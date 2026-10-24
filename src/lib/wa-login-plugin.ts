import type { BetterAuthPlugin } from 'better-auth'
import {
  APIError,
  createAuthEndpoint,
  getIP,
  getSessionFromCtx,
} from 'better-auth/api'
import { setSessionCookie } from 'better-auth/cookies'
import { randomBytes } from 'node:crypto'
import * as z from 'zod'
import { getSharedDb } from '../db/connection'
import {
  auditLogRepository,
  studentsRepository,
  waLoginRepository,
} from '../db/repositories'
import {
  WA_CHALLENGE_TTL_MS,
  WA_MAX_PENDING_PER_IP_PER_HOUR,
  WA_TICKET_TTL_MS,
  formatBusinessNumber,
  generateSecretToken,
  generateWaCode,
  getWaConfig,
  hashIp,
  hashSecret,
  maskPhone,
  secretMatchesHash,
} from './wa-login'
import type { WaConfig } from './wa-login'
import { waMessageText } from './wa-login-types'
import type {
  WaCompleteSignupResponse,
  WaConfigResponse,
  WaPollResponse,
  WaStartResponse,
} from './wa-login-types'

// "Continue with WhatsApp" sign-in as a better-auth plugin: the browser starts a challenge, the
// student sends "PREPPLAN <code>" from her phone, Meta calls /api/webhooks/whatsapp (which marks
// the challenge verified), and the browser's poll then signs her in. Contract with the browser:
// src/lib/wa-login-types.ts. The signature-checked webhook lives in src/routes/api/webhooks.
//
// Only a STUDENT can ever sign in or be created here: an existing user found by phone who is not a
// student, or is switched off, gets 'not_allowed' and no session; complete-signup always creates
// role 'student' (the user-create hook in auth.ts derives the role from signup_type, which this
// file sets itself and no client can influence). Admin and parent accounts are unreachable.

const HOUR_MS = 60 * 60 * 1000

function notEnabled(): never {
  throw new APIError('NOT_FOUND', { error: 'not_enabled', message: 'not_enabled' })
}

function requireConfig(): WaConfig {
  const config = getWaConfig()
  if (!config) notEnabled()
  return config
}

function bad(error: string, message: string, status: 'BAD_REQUEST' | 'CONFLICT' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'TOO_MANY_REQUESTS' = 'BAD_REQUEST'): never {
  throw new APIError(status, { error, message })
}

interface SessionUserShape {
  id: string
  role?: string
  is_active?: boolean
}

export const whatsappLogin = () =>
  ({
    id: 'whatsapp-login',
    // The phone columns are written only by this feature, never by a request body, and never
    // returned in a session payload.
    schema: {
      user: {
        fields: {
          phone_number: {
            type: 'string',
            required: false,
            input: false,
            returned: false,
          },
          phone_number_verified_at: {
            type: 'date',
            required: false,
            input: false,
            returned: false,
          },
        },
      },
    },
    endpoints: {
      whatsappConfig: createAuthEndpoint(
        '/whatsapp/config',
        { method: 'GET' },
        async (ctx) => {
          const config = getWaConfig()
          const body: WaConfigResponse = config
            ? {
                enabled: true,
                business_number_display: formatBusinessNumber(config.businessNumber),
              }
            : { enabled: false, business_number_display: null }
          return ctx.json(body)
        },
      ),

      whatsappStart: createAuthEndpoint(
        '/whatsapp/start',
        {
          method: 'POST',
          body: z.object({ purpose: z.enum(['signin', 'link']) }),
          metadata: { noStore: true },
        },
        async (ctx) => {
          const config = requireConfig()
          const db = getSharedDb()

          let userId: string | null = null
          if (ctx.body.purpose === 'link') {
            const session = await getSessionFromCtx(ctx)
            const user = session?.user as SessionUserShape | undefined
            if (!user || user.role !== 'student' || user.is_active === false) {
              bad('unauthorized', 'Sign in as a student first.', 'UNAUTHORIZED')
            }
            userId = user.id
          }

          const ip = getIP(ctx.request ?? new Headers(ctx.headers ?? {}), ctx.context.options)
          const ipHash = ip ? hashIp(ip) : null
          if (ipHash) {
            const recent = await waLoginRepository.countCreatedByIpSince(
              db,
              ipHash,
              new Date(Date.now() - HOUR_MS),
            )
            if (recent >= WA_MAX_PENDING_PER_IP_PER_HOUR) {
              bad('too_many_requests', 'Too many attempts. Please try again later.', 'TOO_MANY_REQUESTS')
            }
          }

          const pollToken = generateSecretToken()
          const expiresAt = new Date(Date.now() + WA_CHALLENGE_TTL_MS)
          let challenge: Awaited<ReturnType<typeof waLoginRepository.insertChallenge>> | null = null
          for (let attempt = 0; attempt < 5 && !challenge; attempt++) {
            try {
              challenge = await waLoginRepository.insertChallenge(db, {
                code: generateWaCode(),
                poll_token_hash: hashSecret(pollToken),
                purpose: ctx.body.purpose,
                user_id: userId,
                created_ip_hash: ipHash,
                expires_at: expiresAt,
              })
            } catch (err) {
              // 23505 = the (very unlikely) random code already exists: draw another.
              if ((err as { code?: string }).code !== '23505') throw err
            }
          }
          if (!challenge) bad('try_again', 'Could not start. Please try again.', 'CONFLICT')

          const messageText = waMessageText(challenge.code)
          const body: WaStartResponse = {
            challenge_id: challenge.id,
            code: challenge.code,
            message_text: messageText,
            wa_url: `https://wa.me/${config.businessNumber}?text=${encodeURIComponent(messageText)}`,
            poll_token: pollToken,
            expires_at: expiresAt.toISOString(),
          }
          return ctx.json(body)
        },
      ),

      whatsappPoll: createAuthEndpoint(
        '/whatsapp/poll',
        {
          method: 'POST',
          body: z.object({
            challenge_id: z.string().uuid(),
            poll_token: z.string().min(1).max(200),
          }),
          metadata: { noStore: true },
        },
        async (ctx) => {
          requireConfig()
          const db = getSharedDb()
          const challenge = await waLoginRepository.findById(db, ctx.body.challenge_id)
          // A wrong token and an unknown id look exactly the same, and reveal nothing.
          if (
            !challenge ||
            !secretMatchesHash(ctx.body.poll_token, challenge.poll_token_hash)
          ) {
            return ctx.json<WaPollResponse>({ status: 'expired' })
          }
          const expired = new Date(challenge.expires_at).getTime() <= Date.now()
          if (challenge.status === 'consumed' || expired) {
            return ctx.json<WaPollResponse>({ status: 'expired' })
          }
          if (challenge.status === 'pending' || !challenge.phone_e164) {
            return ctx.json<WaPollResponse>({ status: 'pending' })
          }
          const phone = challenge.phone_e164

          if (challenge.purpose === 'link') {
            const session = await getSessionFromCtx(ctx)
            const user = session?.user as SessionUserShape | undefined
            if (
              !user ||
              user.id !== challenge.user_id ||
              user.role !== 'student' ||
              user.is_active === false
            ) {
              bad('unauthorized', 'Sign in as the same student to finish.', 'UNAUTHORIZED')
            }
            const holder = await waLoginRepository.findUserByPhone(db, phone)
            const consumed = await waLoginRepository.consumeVerified(db, challenge.id)
            if (!consumed) return ctx.json<WaPollResponse>({ status: 'pending' })
            if (holder && holder.id !== user.id) {
              return ctx.json<WaPollResponse>({ status: 'phone_in_use' })
            }
            if (!holder && !(await waLoginRepository.setUserPhone(db, user.id, phone))) {
              return ctx.json<WaPollResponse>({ status: 'phone_in_use' })
            }
            const student = await studentsRepository.findByUserId(db, user.id)
            if (student) {
              await auditLogRepository.insert(db, {
                household_id: student.household_id,
                actor_user_id: user.id,
                action: 'student.whatsapp_linked',
                entity: 'students',
                entity_id: student.id,
                before: null,
                after: JSON.stringify({ phone: maskPhone(phone) }),
              })
            }
            return ctx.json<WaPollResponse>({ status: 'linked', phone_masked: maskPhone(phone) })
          }

          // purpose 'signin'
          const holder = await waLoginRepository.findUserByPhone(db, phone)
          if (holder) {
            if (holder.role !== 'student' || !holder.is_active) {
              await waLoginRepository.consumeVerified(db, challenge.id)
              return ctx.json<WaPollResponse>({ status: 'not_allowed' })
            }
            // Single use: exactly one of two concurrent polls gets past this line.
            const consumed = await waLoginRepository.consumeVerified(db, challenge.id)
            if (!consumed) return ctx.json<WaPollResponse>({ status: 'pending' })
            const user = await ctx.context.internalAdapter.findUserById(holder.id)
            if (!user) return ctx.json<WaPollResponse>({ status: 'not_allowed' })
            const session = await ctx.context.internalAdapter.createSession(user.id)
            await setSessionCookie(ctx, { session, user })
            return ctx.json<WaPollResponse>({ status: 'signed_in', is_new_account: false })
          }

          // A number nobody holds yet: a one-use ticket lets her finish sign-up.
          const ticket = generateSecretToken()
          await waLoginRepository.setSignupTicket(
            db,
            challenge.id,
            hashSecret(ticket),
            new Date(Date.now() + WA_TICKET_TTL_MS),
          )
          return ctx.json<WaPollResponse>({
            status: 'needs_signup',
            signup_ticket: ticket,
            phone_masked: maskPhone(phone),
          })
        },
      ),

      whatsappCompleteSignup: createAuthEndpoint(
        '/whatsapp/complete-signup',
        {
          method: 'POST',
          body: z.object({
            signup_ticket: z.string().min(1).max(200),
            name: z.string().max(500),
            consent: z.unknown(),
          }),
          metadata: { noStore: true },
        },
        async (ctx) => {
          requireConfig()
          // The server-side check of the "my parent or guardian agrees" declaration: it is the
          // consent record, so nothing is created without it.
          if (ctx.body.consent !== true) {
            bad('consent_required', 'Please confirm that your parent or guardian agrees.')
          }
          const name = ctx.body.name.trim()
          if (name.length < 1 || name.length > 80) {
            bad('invalid_name', 'Please enter your name (up to 80 characters).')
          }
          const db = getSharedDb()
          const spent = await waLoginRepository.consumeByTicket(
            db,
            hashSecret(ctx.body.signup_ticket),
          )
          if (!spent?.phone_e164) {
            bad('invalid_ticket', 'This sign-up link has expired. Please start again.')
          }
          const phone = spent.phone_e164
          if (await waLoginRepository.findUserByPhone(db, phone)) {
            bad('phone_in_use', 'This number cannot be used to sign up.', 'CONFLICT')
          }

          // A random placeholder, not the phone digits: the number is personal data and is already
          // stored (once) in users.phone_number; the unreceivable .invalid address must not copy it.
          let email = `wa-${randomBytes(8).toString('hex')}@phone.prepplan.invalid`
          while (await waLoginRepository.userEmailExists(db, email)) {
            email = `wa-${randomBytes(8).toString('hex')}@phone.prepplan.invalid`
          }
          // Through the internal adapter so the user-create hooks in auth.ts run: household,
          // student profile and consent row, exactly as for an email sign-up. The role comes from
          // signup_type, which is fixed here.
          const user = await ctx.context.internalAdapter.createUser(
            {
              email,
              emailVerified: false,
              name,
              signup_type: 'student',
              auth_provider: 'whatsapp',
              phone_number: phone,
              phone_number_verified_at: new Date(),
            },
            { method: 'whatsapp' },
          )
          const session = await ctx.context.internalAdapter.createSession(user.id)
          await setSessionCookie(ctx, { session, user })
          const body: WaCompleteSignupResponse = { status: 'signed_in', is_new_account: true }
          return ctx.json(body)
        },
      ),
    },
  }) satisfies BetterAuthPlugin
