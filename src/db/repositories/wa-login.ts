import type { Insertable } from 'kysely'
import { sql } from 'kysely'
import type { Db } from '../connection'
import type { WaLoginChallenges } from '../types'

// "Continue with WhatsApp" sign-in storage. Challenges are never deleted: they move
// pending -> verified -> consumed, and "expired" is derived from expires_at (CLAUDE.md invariant 4).
// Every state change here is a single conditional UPDATE ... RETURNING, so two concurrent callers
// cannot both win the same challenge.
export const waLoginRepository = {
  async insertChallenge(db: Db, row: Insertable<WaLoginChallenges>) {
    return db
      .insertInto('wa_login_challenges')
      .values(row)
      .returningAll()
      .executeTakeFirstOrThrow()
  },

  async findById(db: Db, id: string) {
    return db
      .selectFrom('wa_login_challenges')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
  },

  /** Challenges started from one (hashed) address since `since`: the per-address flood guard. */
  async countCreatedByIpSince(db: Db, ipHash: string, since: Date) {
    const row = await db
      .selectFrom('wa_login_challenges')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('created_ip_hash', '=', ipHash)
      .where('created_at', '>=', since)
      .executeTakeFirstOrThrow()
    return Number(row.c)
  },

  /** Challenges one phone number has verified since `since`: the per-number flood guard. */
  async countVerifiedForPhoneSince(db: Db, phone: string, since: Date) {
    const row = await db
      .selectFrom('wa_login_challenges')
      .select((eb) => eb.fn.countAll<string>().as('c'))
      .where('phone_e164', '=', phone)
      .where('verified_at', '>=', since)
      .executeTakeFirstOrThrow()
    return Number(row.c)
  },

  /** pending + unexpired -> verified with this phone; undefined when the code matches nothing live. */
  async verifyPendingByCode(
    db: Db,
    input: { code: string; phone: string; wamid: string },
  ) {
    return db
      .updateTable('wa_login_challenges')
      .set({
        status: 'verified',
        phone_e164: input.phone,
        wamid: input.wamid,
        verified_at: sql`now()`,
      })
      .where('code', '=', input.code)
      .where('status', '=', 'pending')
      .where('expires_at', '>', sql<Date>`now()`)
      .returningAll()
      .executeTakeFirst()
  },

  /** verified + unexpired -> consumed. Exactly one caller gets the row back. */
  async consumeVerified(db: Db, id: string) {
    return db
      .updateTable('wa_login_challenges')
      .set({ status: 'consumed', consumed_at: sql`now()` })
      .where('id', '=', id)
      .where('status', '=', 'verified')
      .where('expires_at', '>', sql<Date>`now()`)
      .returningAll()
      .executeTakeFirst()
  },

  async setSignupTicket(db: Db, id: string, ticketHash: string, expiresAt: Date) {
    await db
      .updateTable('wa_login_challenges')
      .set({ signup_ticket_hash: ticketHash, signup_ticket_expires_at: expiresAt })
      .where('id', '=', id)
      .where('status', '=', 'verified')
      .execute()
  },

  /** A live sign-up ticket is spent exactly once: verified -> consumed in one statement. */
  async consumeByTicket(db: Db, ticketHash: string) {
    return db
      .updateTable('wa_login_challenges')
      .set({ status: 'consumed', consumed_at: sql`now()` })
      .where('signup_ticket_hash', '=', ticketHash)
      .where('status', '=', 'verified')
      .where('purpose', '=', 'signin')
      .where('signup_ticket_expires_at', '>', sql<Date>`now()`)
      .returningAll()
      .executeTakeFirst()
  },

  /** True the first time a Meta message id is seen, false for a replayed delivery. */
  async recordInbound(db: Db, wamid: string): Promise<boolean> {
    const row = await db
      .insertInto('wa_inbound_messages')
      .values({ wamid })
      .onConflict((oc) => oc.column('wamid').doNothing())
      .returning('wamid')
      .executeTakeFirst()
    return row !== undefined
  },

  async findUserByPhone(db: Db, phone: string) {
    return db
      .selectFrom('users')
      .select(['id', 'role', 'is_active', 'household_id', 'name'])
      .where('phone_number', '=', phone)
      .executeTakeFirst()
  },

  async findUserPhone(db: Db, userId: string) {
    return db
      .selectFrom('users')
      .select(['phone_number', 'phone_number_verified_at'])
      .where('id', '=', userId)
      .executeTakeFirst()
  },

  /** False when the unique index says another account already holds this number. */
  async setUserPhone(db: Db, userId: string, phone: string): Promise<boolean> {
    try {
      await db
        .updateTable('users')
        .set({ phone_number: phone, phone_number_verified_at: sql`now()` })
        .where('id', '=', userId)
        .execute()
      return true
    } catch (err) {
      if ((err as { code?: string }).code === '23505') return false
      throw err
    }
  },

  async clearUserPhone(db: Db, userId: string) {
    await db
      .updateTable('users')
      .set({ phone_number: null, phone_number_verified_at: null })
      .where('id', '=', userId)
      .execute()
  },

  /** Does she have a way in other than WhatsApp: a password account or a Google account? */
  async hasOtherSignInMethod(db: Db, userId: string): Promise<boolean> {
    const row = await db
      .selectFrom('accounts')
      .select('id')
      .where('user_id', '=', userId)
      .where((eb) =>
        eb.or([
          eb.and([
            eb('provider_id', '=', 'credential'),
            eb('password', 'is not', null),
          ]),
          eb('provider_id', '=', 'google'),
        ]),
      )
      .limit(1)
      .executeTakeFirst()
    return row !== undefined
  },

  async userEmailExists(db: Db, email: string): Promise<boolean> {
    const row = await db
      .selectFrom('users')
      .select('id')
      .where('email', '=', email.toLowerCase())
      .executeTakeFirst()
    return row !== undefined
  },
}
