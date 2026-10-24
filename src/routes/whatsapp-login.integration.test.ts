import { createHmac, randomInt } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'


import { createDb } from '../db/connection'
import type { Db } from '../db/connection'
import { auth } from '../lib/auth'
import { createParentSession, promoteToAdmin } from '../db/test-helpers'
import { Route as WebhookRoute } from './api/webhooks/whatsapp'
import { Route as MeWhatsappRoute } from './api/students/me/whatsapp'
import { Route as ProfileRoute } from './api/students/me/profile'

// Set before any module reads the env (vi.hoisted runs ahead of the imports).
vi.hoisted(() => {
  process.env.WHATSAPP_BUSINESS_NUMBER = '919876543210'
  process.env.WHATSAPP_APP_SECRET = 'test-app-secret'
  process.env.WHATSAPP_VERIFY_TOKEN = 'test-verify-token'
  delete process.env.WHATSAPP_ACCESS_TOKEN
  delete process.env.WHATSAPP_PHONE_NUMBER_ID
})

type RouteHandler = (opts: { request: Request }) => Promise<Response>
const handlerFor = (route: { options: { server?: unknown } }, method: string) =>
  (route.options.server as { handlers: Record<string, RouteHandler> }).handlers[method]

const SECRET = 'test-app-secret'
let ipCounter = 0
const freshIp = () => `10.77.${Math.floor(ipCounter / 250)}.${(ipCounter++ % 250) + 1}`
const freshPhone = () => `919${randomInt(100000000, 999999999)}`

async function api(
  path: string,
  init: { method?: string; body?: unknown; cookie?: string; ip?: string } = {},
): Promise<Response> {
  return auth.handler(
    new Request(`http://localhost:3000/api/auth${path}`, {
      method: init.method ?? 'POST',
      headers: {
        'content-type': 'application/json',
        origin: 'http://localhost:3000',
        'x-forwarded-for': init.ip ?? freshIp(),
        ...(init.cookie ? { cookie: init.cookie } : {}),
      },
      body: init.method === 'GET' ? undefined : JSON.stringify(init.body ?? {}),
    }),
  )
}

const cookieOf = (res: Response) =>
  res.headers
    .getSetCookie()
    .map((c) => c.split(';')[0])
    .join('; ')

interface Started {
  challenge_id: string
  code: string
  message_text: string
  wa_url: string
  poll_token: string
  expires_at: string
}
async function start(purpose: 'signin' | 'link' = 'signin', cookie?: string, ip?: string) {
  const res = await api('/whatsapp/start', { body: { purpose }, cookie, ip })
  return { res, body: (await res.json()) as Started }
}

const sign = (raw: string, secret = SECRET) =>
  `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`

let wamidCounter = 0
function metaPayload(from: string, text: string, wamid?: string, type = 'text') {
  return JSON.stringify({
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'x',
        changes: [
          {
            field: 'messages',
            value: {
              messages: [
                {
                  from,
                  id: wamid ?? `wamid.test.${Date.now()}.${wamidCounter++}`,
                  type,
                  text: { body: text },
                },
              ],
            },
          },
        ],
      },
    ],
  })
}
async function webhook(raw: string, signature: string | null = sign(raw)) {
  return handlerFor(WebhookRoute, 'POST')({
    request: new Request('http://localhost/api/webhooks/whatsapp', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(signature ? { 'x-hub-signature-256': signature } : {}),
      },
      body: raw,
    }),
  })
}
const sendMessage = (code: string, from: string) =>
  webhook(metaPayload(from, `PREPPLAN ${code}`))

async function poll(s: Started, token = s.poll_token, cookie?: string) {
  const res = await api('/whatsapp/poll', {
    body: { challenge_id: s.challenge_id, poll_token: token },
    cookie,
  })
  return { res, json: (await res.json()) as Record<string, unknown> }
}

describe('Continue with WhatsApp (server)', () => {
  const db: Db = createDb()
  const householdIds: Array<string> = []
  const userIds: Array<string> = []

  async function makeUser(opts: { role?: 'student' | 'parent' | 'admin'; phone?: string; active?: boolean }) {
    let userId: string
    let householdId: string
    let cookie = ''
    if ((opts.role ?? 'student') === 'student') {
      const email = `wa-fixture-${Date.now()}-${randomInt(1e9)}@example.com`
      const up = await auth.api.signUpEmail({
        body: { email, password: 'correcthorsebatterystaple', name: 'WA Fixture', signup_type: 'student' },
      })
      userId = up.user.id
      householdId = up.user.household_id as string
      const signIn = await auth.api.signInEmail({
        body: { email, password: 'correcthorsebatterystaple' },
        asResponse: true,
      })
      cookie = signIn.headers.get('set-cookie')!.split(';')[0]
    } else {
      const p = await createParentSession('wa-fixture')
      userId = p.userId
      householdId = p.householdId
      cookie = p.cookie
      if (opts.role === 'admin') await promoteToAdmin(userId)
    }
    householdIds.push(householdId)
    userIds.push(userId)
    if (opts.phone) await db.updateTable('users').set({ phone_number: opts.phone }).where('id', '=', userId).execute()
    if (opts.active === false) await db.updateTable('users').set({ is_active: false }).where('id', '=', userId).execute()
    return { userId, householdId, cookie }
  }

  const sessionCount = async (userId: string) =>
    Number(
      (await db.selectFrom('sessions').select((eb) => eb.fn.countAll<string>().as('c')).where('user_id', '=', userId).executeTakeFirstOrThrow()).c,
    )

  afterAll(async () => {
    for (const id of userIds) {
      await db.deleteFrom('wa_login_challenges').where('user_id', '=', id).execute()
    }
    // Sign-in challenges (no user_id) from this file used our fixture phones.
    await db.deleteFrom('wa_login_challenges').where('created_ip_hash', 'is not', null).where('created_at', '>', new Date(Date.now() - 3600_000)).execute()
    // WhatsApp-created students are found by their placeholder email.
    const created = await db.selectFrom('users').select(['id', 'household_id']).where('email', 'like', 'wa-%@phone.prepplan.invalid').execute()
    for (const u of created) {
      userIds.push(u.id)
      householdIds.push(u.household_id)
    }
    for (const hh of householdIds) {
      await db.deleteFrom('audit_log').where('household_id', '=', hh).execute()
      await db.deleteFrom('consents').where('household_id', '=', hh).execute()
      await db.updateTable('students').set({ user_id: null }).where('household_id', '=', hh).execute()
      await db.deleteFrom('users').where('household_id', '=', hh).execute()
      await db.deleteFrom('households').where('id', '=', hh).execute()
    }
    await db.destroy()
  })

  beforeAll(async () => {
    // Fixture hygiene: leftovers from a crashed earlier run.
    await db.deleteFrom('wa_inbound_messages').where('wamid', 'like', 'wamid.test.%').execute()
  })

  it('config reports enabled with the display number', async () => {
    const res = await api('/whatsapp/config', { method: 'GET' })
    expect(await res.json()).toEqual({ enabled: true, business_number_display: '+91 98765 43210' })
  })

  it('start returns code, link and token and stores only hashes', async () => {
    const { res, body } = await start()
    expect(res.status).toBe(200)
    expect(body.code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ2-9]{8}$/)
    expect(body.message_text).toBe(`PREPPLAN ${body.code}`)
    expect(body.wa_url).toBe(`https://wa.me/919876543210?text=${encodeURIComponent(body.message_text)}`)
    const left = new Date(body.expires_at).getTime() - Date.now()
    expect(left).toBeGreaterThan(9 * 60_000)
    expect(left).toBeLessThanOrEqual(10 * 60_000)
    const row = await db.selectFrom('wa_login_challenges').selectAll().where('id', '=', body.challenge_id).executeTakeFirstOrThrow()
    expect(row.status).toBe('pending')
    expect(row.poll_token_hash).not.toBe(body.poll_token)
    expect(JSON.stringify(row)).not.toContain(body.poll_token)
    expect(row.created_ip_hash).not.toBeNull()
    expect(row.created_ip_hash).not.toMatch(/^10\./)
  })

  it('start for link needs a signed-in student', async () => {
    const anon = await api('/whatsapp/start', { body: { purpose: 'link' } })
    expect(anon.status).toBe(401)
    const parent = await makeUser({ role: 'parent' })
    const asParent = await api('/whatsapp/start', { body: { purpose: 'link' }, cookie: parent.cookie })
    expect(asParent.status).toBe(401)
  })

  describe('webhook', () => {
    it('GET handshake: accepted with the right token, refused otherwise', async () => {
      const get = handlerFor(WebhookRoute, 'GET')
      const ok = await get({ request: new Request('http://localhost/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=12345') })
      expect(ok.status).toBe(200)
      expect(await ok.text()).toBe('12345')
      expect(ok.headers.get('content-type')).toContain('text/plain')
      for (const q of ['hub.mode=subscribe&hub.verify_token=nope&hub.challenge=1', 'hub.mode=unsubscribe&hub.verify_token=test-verify-token&hub.challenge=1', 'hub.challenge=1']) {
        const bad = await get({ request: new Request(`http://localhost/api/webhooks/whatsapp?${q}`) })
        expect(bad.status).toBe(403)
      }
    })

    it('a signed message verifies the challenge with the sender number', async () => {
      const { body } = await start()
      const phone = freshPhone()
      expect((await sendMessage(body.code, phone)).status).toBe(200)
      const row = await db.selectFrom('wa_login_challenges').selectAll().where('id', '=', body.challenge_id).executeTakeFirstOrThrow()
      expect(row.status).toBe('verified')
      expect(row.phone_e164).toBe(`+${phone}`)
      expect(row.wamid).toMatch(/^wamid\.test\./)
      expect(row.verified_at).not.toBeNull()
    })

    it('a bad or missing signature is 401 and changes nothing', async () => {
      const { body } = await start()
      const raw = metaPayload(freshPhone(), `PREPPLAN ${body.code}`)
      expect((await webhook(raw, sign(raw, 'wrong-secret'))).status).toBe(401)
      expect((await webhook(raw, null)).status).toBe(401)
      expect((await webhook(raw, 'sha256=00')).status).toBe(401)
      const row = await db.selectFrom('wa_login_challenges').select(['status', 'phone_e164']).where('id', '=', body.challenge_id).executeTakeFirstOrThrow()
      expect(row).toEqual({ status: 'pending', phone_e164: null })
    })

    it('ignores a replayed message id', async () => {
      const a = await start()
      const b = await start()
      const wamid = `wamid.test.replay.${Date.now()}`
      const phone = freshPhone()
      await webhook(metaPayload(phone, `PREPPLAN ${a.body.code}`, wamid))
      // Same wamid again, this time naming a different live challenge: must be skipped.
      expect((await webhook(metaPayload(phone, `PREPPLAN ${b.body.code}`, wamid))).status).toBe(200)
      const rowB = await db.selectFrom('wa_login_challenges').select('status').where('id', '=', b.body.challenge_id).executeTakeFirstOrThrow()
      expect(rowB.status).toBe('pending')
    })

    it('ignores messages without the keyword, with unknown, expired or used codes, and non-text', async () => {
      const { body } = await start()
      const phone = freshPhone()
      await webhook(metaPayload(phone, body.code)) // no keyword
      await webhook(metaPayload(phone, 'PREPPLAN ZZZZZZZZ')) // unknown
      await webhook(metaPayload(phone, `PREPPLAN ${body.code}`, undefined, 'image')) // not text
      let row = await db.selectFrom('wa_login_challenges').select('status').where('id', '=', body.challenge_id).executeTakeFirstOrThrow()
      expect(row.status).toBe('pending')

      await db.updateTable('wa_login_challenges').set({ expires_at: new Date(Date.now() - 1000) }).where('id', '=', body.challenge_id).execute()
      await sendMessage(body.code, phone) // expired
      row = await db.selectFrom('wa_login_challenges').select('status').where('id', '=', body.challenge_id).executeTakeFirstOrThrow()
      expect(row.status).toBe('pending')

      const used = await start()
      await sendMessage(used.body.code, phone)
      const first = await db.selectFrom('wa_login_challenges').select('phone_e164').where('id', '=', used.body.challenge_id).executeTakeFirstOrThrow()
      await sendMessage(used.body.code, freshPhone()) // already verified: another number cannot take it over
      const second = await db.selectFrom('wa_login_challenges').select('phone_e164').where('id', '=', used.body.challenge_id).executeTakeFirstOrThrow()
      expect(second.phone_e164).toBe(first.phone_e164)
    })

    it('stops verifying a number after 10 in an hour', async () => {
      const phone = freshPhone()
      for (let i = 0; i < 10; i++) {
        const s = await start()
        await sendMessage(s.body.code, phone)
      }
      const extra = await start()
      await sendMessage(extra.body.code, phone)
      const row = await db.selectFrom('wa_login_challenges').select('status').where('id', '=', extra.body.challenge_id).executeTakeFirstOrThrow()
      expect(row.status).toBe('pending')
    })
  })

  describe('poll', () => {
    it('pending until the message arrives; a wrong token never signs in or leaks', async () => {
      const student = await makeUser({ phone: `+${freshPhone()}` })
      const phone = (await db.selectFrom('users').select('phone_number').where('id', '=', student.userId).executeTakeFirstOrThrow()).phone_number!
      const sessionsBefore = await sessionCount(student.userId)
      const s = await start()
      expect((await poll(s.body)).json).toEqual({ status: 'pending' })
      await sendMessage(s.body.code, phone.slice(1))
      const wrong = await poll(s.body, 'not-the-token')
      expect(wrong.json).toEqual({ status: 'expired' })
      expect(wrong.res.headers.getSetCookie()).toHaveLength(0)
      expect((await poll({ ...s.body, challenge_id: '00000000-0000-4000-8000-000000000000' })).json).toEqual({ status: 'expired' })
      expect(await sessionCount(student.userId)).toBe(sessionsBefore)
      // The real token still works afterwards.
      const ok = await poll(s.body)
      expect(ok.json).toEqual({ status: 'signed_in', is_new_account: false })
    })

    it('signs in an existing student; the cookie works', async () => {
      const phone = freshPhone()
      const student = await makeUser({ phone: `+${phone}` })
      const s = await start()
      await sendMessage(s.body.code, phone)
      const { res, json } = await poll(s.body)
      expect(json).toEqual({ status: 'signed_in', is_new_account: false })
      const cookie = cookieOf(res)
      expect(cookie).not.toBe('')
      const profile = await handlerFor(ProfileRoute, 'GET')({
        request: new Request('http://localhost/api/students/me/profile', { headers: { cookie } }),
      })
      expect(profile.status).toBe(200)
      const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
      expect(session!.user.id).toBe(student.userId)
      // Single use: asking again is not a second sign-in.
      expect((await poll(s.body)).json).toEqual({ status: 'expired' })
    })

    it('two concurrent polls produce one session', async () => {
      const phone = freshPhone()
      const student = await makeUser({ phone: `+${phone}` })
      const before = await sessionCount(student.userId)
      const s = await start()
      await sendMessage(s.body.code, phone)
      const [a, b] = await Promise.all([poll(s.body), poll(s.body)])
      const signedIn = [a, b].filter((r) => r.json.status === 'signed_in')
      expect(signedIn).toHaveLength(1)
      expect(await sessionCount(student.userId)).toBe(before + 1)
    })

    it('an expired challenge polls as expired', async () => {
      const s = await start()
      await db.updateTable('wa_login_challenges').set({ expires_at: new Date(Date.now() - 1000) }).where('id', '=', s.body.challenge_id).execute()
      expect((await poll(s.body)).json).toEqual({ status: 'expired' })
    })

    it.each(['parent', 'admin'] as const)('a %s account with that phone is not_allowed and gets no session', async (role) => {
      const phone = freshPhone()
      const user = await makeUser({ role, phone: `+${phone}` })
      const before = await sessionCount(user.userId)
      const s = await start()
      await sendMessage(s.body.code, phone)
      const { res, json } = await poll(s.body)
      expect(json).toEqual({ status: 'not_allowed' })
      expect(res.headers.getSetCookie()).toHaveLength(0)
      expect(await sessionCount(user.userId)).toBe(before)
    })

    it('a switched-off student is not_allowed', async () => {
      const phone = freshPhone()
      const user = await makeUser({ phone: `+${phone}`, active: false })
      const before = await sessionCount(user.userId)
      const s = await start()
      await sendMessage(s.body.code, phone)
      expect((await poll(s.body)).json).toEqual({ status: 'not_allowed' })
      expect(await sessionCount(user.userId)).toBe(before)
    })
  })

  describe('new number: needs_signup then complete-signup', () => {
    async function toTicket() {
      const phone = freshPhone()
      const s = await start()
      await sendMessage(s.body.code, phone)
      const { json } = await poll(s.body)
      expect(json.status).toBe('needs_signup')
      return { phone, s, ticket: json.signup_ticket as string, masked: json.phone_masked as string }
    }
    const complete = (body: unknown) => api('/whatsapp/complete-signup', { body })

    it('creates a student with household, student row and consent, and signs in', async () => {
      const { phone, ticket, masked } = await toTicket()
      expect(masked).toBe(`+91 ••••• ••${phone.slice(-3)}`)
      const res = await complete({ signup_ticket: ticket, name: '  Asha  ', consent: true })
      expect(res.status).toBe(200)
      expect(await res.json()).toEqual({ status: 'signed_in', is_new_account: true })
      const cookie = cookieOf(res)
      const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
      const userId = session!.user.id
      const user = await db.selectFrom('users').selectAll().where('id', '=', userId).executeTakeFirstOrThrow()
      expect(user.role).toBe('student')
      expect(user.signup_type).toBe('student')
      expect(user.name).toBe('Asha')
      expect(user.phone_number).toBe(`+${phone}`)
      expect(user.phone_number_verified_at).not.toBeNull()
      expect(user.auth_provider).toBe('whatsapp')
      // A random, unreceivable placeholder: it must not contain the phone number.
      expect(user.email).toMatch(/^wa-[0-9a-f]{16}@phone\.prepplan\.invalid$/)
      expect(user.email).not.toContain(phone)
      const student = await db.selectFrom('students').select(['id', 'user_id', 'household_id']).where('user_id', '=', userId).executeTakeFirstOrThrow()
      expect(student.household_id).toBe(user.household_id)
      const consents = await db.selectFrom('consents').select('id').where('student_id', '=', student.id).execute()
      expect(consents).toHaveLength(1)
      const profile = await handlerFor(ProfileRoute, 'GET')({
        request: new Request('http://localhost/api/students/me/profile', { headers: { cookie } }),
      })
      expect(profile.status).toBe(200)
      // The session payload never carries the phone number.
      expect(JSON.stringify(session!.user)).not.toContain('phone_number')
    })

    it('refuses without consent === true and creates nothing, and the ticket survives', async () => {
      const { phone, ticket } = await toTicket()
      for (const consent of [false, 'true', undefined, 1]) {
        const res = await complete({ signup_ticket: ticket, name: 'Asha', consent })
        expect(res.status).toBe(400)
      }
      expect(await db.selectFrom('users').select('id').where('phone_number', '=', `+${phone}`).execute()).toHaveLength(0)
      expect((await complete({ signup_ticket: ticket, name: 'Asha', consent: true })).status).toBe(200)
    })

    it('rejects an empty or over-long name', async () => {
      const { ticket } = await toTicket()
      expect((await complete({ signup_ticket: ticket, name: '   ', consent: true })).status).toBe(400)
      expect((await complete({ signup_ticket: ticket, name: 'x'.repeat(81), consent: true })).status).toBe(400)
    })

    it('a ticket works once, and not after it expires, and a random one never', async () => {
      const first = await toTicket()
      expect((await complete({ signup_ticket: first.ticket, name: 'Asha', consent: true })).status).toBe(200)
      expect((await complete({ signup_ticket: first.ticket, name: 'Asha', consent: true })).status).toBe(400)

      const second = await toTicket()
      await db.updateTable('wa_login_challenges').set({ signup_ticket_expires_at: new Date(Date.now() - 1000) }).where('id', '=', second.s.body.challenge_id).execute()
      expect((await complete({ signup_ticket: second.ticket, name: 'Asha', consent: true })).status).toBe(400)
      expect((await complete({ signup_ticket: 'made-up-ticket', name: 'Asha', consent: true })).status).toBe(400)
    })

    it('stores the ticket only as a hash', async () => {
      const { ticket, s } = await toTicket()
      const row = await db.selectFrom('wa_login_challenges').selectAll().where('id', '=', s.body.challenge_id).executeTakeFirstOrThrow()
      expect(row.signup_ticket_hash).not.toBeNull()
      expect(JSON.stringify(row)).not.toContain(ticket)
    })

    it('cannot be used to create any other role: a body signup_type is ignored', async () => {
      const { ticket } = await toTicket()
      const res = await complete({ signup_ticket: ticket, name: 'Mallory', consent: true, signup_type: 'parent', role: 'admin' })
      expect(res.status).toBe(200)
      const session = await auth.api.getSession({ headers: new Headers({ cookie: cookieOf(res) }) })
      const user = await db.selectFrom('users').select('role').where('id', '=', session!.user.id).executeTakeFirstOrThrow()
      expect(user.role).toBe('student')
    })
  })

  describe('link a number to a signed-in student', () => {
    it('attaches it, and refuses a number another account holds', async () => {
      const mine = await makeUser({})
      const phone = freshPhone()
      const s = await start('link', mine.cookie)
      expect(s.res.status).toBe(200)
      await sendMessage(s.body.code, phone)
      // Another browser (no cookie) cannot finish it.
      expect((await poll(s.body)).res.status).toBe(401)
      const done = await poll(s.body, s.body.poll_token, mine.cookie)
      expect(done.json).toEqual({ status: 'linked', phone_masked: `+91 ••••• ••${phone.slice(-3)}` })
      const row = await db.selectFrom('users').select(['phone_number', 'phone_number_verified_at']).where('id', '=', mine.userId).executeTakeFirstOrThrow()
      expect(row.phone_number).toBe(`+${phone}`)
      expect(row.phone_number_verified_at).not.toBeNull()
      const audit = await db.selectFrom('audit_log').select('action').where('household_id', '=', mine.householdId).where('action', '=', 'student.whatsapp_linked').execute()
      expect(audit).toHaveLength(1)

      const other = await makeUser({})
      const s2 = await start('link', other.cookie)
      await sendMessage(s2.body.code, phone)
      expect((await poll(s2.body, s2.body.poll_token, other.cookie)).json).toEqual({ status: 'phone_in_use' })
      const otherRow = await db.selectFrom('users').select('phone_number').where('id', '=', other.userId).executeTakeFirstOrThrow()
      expect(otherRow.phone_number).toBeNull()
    })

    it("another student's session cannot finish my challenge", async () => {
      const mine = await makeUser({})
      const other = await makeUser({})
      const s = await start('link', mine.cookie)
      await sendMessage(s.body.code, freshPhone())
      expect((await poll(s.body, s.body.poll_token, other.cookie)).res.status).toBe(401)
    })
  })

  describe('/api/students/me/whatsapp', () => {
    const get = (cookie: string) => handlerFor(MeWhatsappRoute, 'GET')({ request: new Request('http://localhost/api/students/me/whatsapp', { headers: { cookie } }) })
    const del = (cookie: string) => handlerFor(MeWhatsappRoute, 'DELETE')({ request: new Request('http://localhost/api/students/me/whatsapp', { method: 'DELETE', headers: { cookie } }) })

    it('can_unlink is true with a password, and DELETE clears the number with an audit entry', async () => {
      const phone = freshPhone()
      const u = await makeUser({ phone: `+${phone}` })
      expect(await (await get(u.cookie)).json()).toEqual({ linked: true, phone_masked: `+91 ••••• ••${phone.slice(-3)}`, can_unlink: true })
      expect((await del(u.cookie)).status).toBe(200)
      const row = await db.selectFrom('users').select(['phone_number', 'phone_number_verified_at']).where('id', '=', u.userId).executeTakeFirstOrThrow()
      expect(row).toEqual({ phone_number: null, phone_number_verified_at: null })
      const audit = await db.selectFrom('audit_log').select('action').where('household_id', '=', u.householdId).where('action', '=', 'student.whatsapp_unlinked').execute()
      expect(audit).toHaveLength(1)
      expect(await (await get(u.cookie)).json()).toMatchObject({ linked: false, phone_masked: null })
    })

    it('a WhatsApp-only student cannot unlink: 409 and the number stays', async () => {
      const phone = freshPhone()
      const s = await start()
      await sendMessage(s.body.code, phone)
      const ticket = (await poll(s.body)).json.signup_ticket
      const res = await api('/whatsapp/complete-signup', { body: { signup_ticket: ticket, name: 'Only WA', consent: true } })
      const cookie = cookieOf(res)
      expect(await (await get(cookie)).json()).toMatchObject({ linked: true, can_unlink: false })
      expect((await del(cookie)).status).toBe(409)
      const row = await db.selectFrom('users').select('phone_number').where('phone_number', '=', `+${phone}`).executeTakeFirst()
      expect(row).toBeDefined()
    })

    it('needs a student session', async () => {
      const parent = await makeUser({ role: 'parent' })
      expect((await get(parent.cookie)).status).toBe(403)
      expect((await get('')).status).toBe(401)
    })
  })

  it('limits one address to 20 challenges an hour', async () => {
    const ip = freshIp()
    for (let i = 0; i < 20; i++) {
      expect((await start('signin', undefined, ip)).res.status).toBe(200)
    }
    expect((await start('signin', undefined, ip)).res.status).toBe(429)
    // Another address is unaffected.
    expect((await start()).res.status).toBe(200)
  })
})
