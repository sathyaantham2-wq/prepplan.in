import type { Kysely } from 'kysely'
import { sql } from 'kysely'

// "Continue with WhatsApp" sign-in. A student proves her phone number by sending a short message
// from it to the PrepPlan business number; Meta calls our webhook, and the browser that started the
// challenge is signed in. Nothing here is ever deleted (CLAUDE.md invariant 4): a challenge moves
// pending -> verified -> consumed, and "expired" is derived from expires_at.
//
//  - users.phone_number: E.164 with '+', unique where set. Only a student's number is ever used
//    to sign in; the sign-in code refuses any other role.
//  - wa_login_challenges: one row per attempt. The poll token and the sign-up ticket are stored
//    only as hashes, the client IP only as a keyed hash.
//    user_id is set null (not blocking) when a student's data is hard-deleted (privacy delete).
//  - wa_inbound_messages: one row per Meta message id, so a replayed webhook delivery is ignored.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('phone_number', 'text')
    .addColumn('phone_number_verified_at', 'timestamptz')
    .execute()
  await sql`create unique index users_phone_number_uidx on users (phone_number) where phone_number is not null`.execute(
    db,
  )

  await db.schema
    .createTable('wa_login_challenges')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('code', 'text', (col) => col.notNull().unique())
    .addColumn('poll_token_hash', 'text', (col) => col.notNull())
    .addColumn('purpose', 'text', (col) =>
      col.notNull().check(sql`purpose in ('signin', 'link')`),
    )
    .addColumn('user_id', 'uuid', (col) => col.references('users.id').onDelete('set null'))
    .addColumn('status', 'text', (col) =>
      col
        .notNull()
        .defaultTo('pending')
        .check(sql`status in ('pending', 'verified', 'consumed')`),
    )
    .addColumn('phone_e164', 'text')
    .addColumn('wamid', 'text')
    .addColumn('signup_ticket_hash', 'text')
    .addColumn('signup_ticket_expires_at', 'timestamptz')
    .addColumn('created_ip_hash', 'text')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('expires_at', 'timestamptz', (col) => col.notNull())
    .addColumn('verified_at', 'timestamptz')
    .addColumn('consumed_at', 'timestamptz')
    .execute()
  await db.schema
    .createIndex('wa_login_challenges_ip_idx')
    .on('wa_login_challenges')
    .columns(['created_ip_hash', 'created_at'])
    .execute()
  await db.schema
    .createIndex('wa_login_challenges_phone_idx')
    .on('wa_login_challenges')
    .columns(['phone_e164', 'verified_at'])
    .execute()
  await sql`create index wa_login_challenges_ticket_idx on wa_login_challenges (signup_ticket_hash) where signup_ticket_hash is not null`.execute(
    db,
  )

  await db.schema
    .createTable('wa_inbound_messages')
    .addColumn('wamid', 'text', (col) => col.primaryKey())
    .addColumn('received_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('wa_inbound_messages').execute()
  await db.schema.dropTable('wa_login_challenges').execute()
  await sql`drop index if exists users_phone_number_uidx`.execute(db)
  await db.schema
    .alterTable('users')
    .dropColumn('phone_number_verified_at')
    .dropColumn('phone_number')
    .execute()
}
