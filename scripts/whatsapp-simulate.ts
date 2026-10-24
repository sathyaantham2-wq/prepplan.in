// Developer tool: pretend to be Meta. Sends a correctly SIGNED fake WhatsApp webhook to a local dev
// server so the whole "Continue with WhatsApp" flow can be tried before Meta is configured.
//
//   WHATSAPP_APP_SECRET=... npx tsx scripts/whatsapp-simulate.ts --code K7M2XQ9A --from 919876543210
//   [--url http://localhost:3000] [--text "PREPPLAN K7M2XQ9A"] [--wamid wamid.test1]
//
// The dev server must run with the same WHATSAPP_APP_SECRET (plus WHATSAPP_BUSINESS_NUMBER and
// WHATSAPP_VERIFY_TOKEN, which switch the feature on). Never point this at production.
import { createHmac, randomUUID } from 'node:crypto'

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}

const code = arg('code')
const from = arg('from')
const url = arg('url') ?? 'http://localhost:3000'
const secret = process.env.WHATSAPP_APP_SECRET

if (!code || !from || !secret) {
  console.error(
    'Usage: WHATSAPP_APP_SECRET=... npx tsx scripts/whatsapp-simulate.ts --code K7M2XQ9A --from 919876543210 [--url http://localhost:3000]',
  )
  process.exit(1)
}
if (/prepplan\.in/i.test(url)) {
  console.error('Refusing to send a simulated message to the live site.')
  process.exit(1)
}

const wamid = arg('wamid') ?? `wamid.SIM${randomUUID().replace(/-/g, '')}`
const payload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'SIMULATED',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            messages: [
              {
                from: from.replace(/\D/g, ''),
                id: wamid,
                timestamp: String(Math.floor(Date.now() / 1000)),
                type: 'text',
                text: { body: arg('text') ?? `PREPPLAN ${code}` },
              },
            ],
          },
        },
      ],
    },
  ],
}
const raw = JSON.stringify(payload)
const signature = `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`

const res = await fetch(`${url.replace(/\/$/, '')}/api/webhooks/whatsapp`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', 'x-hub-signature-256': signature },
  body: raw,
})
console.log(`Webhook answered ${res.status}${res.status === 200 ? ' (accepted)' : ''}`)
if (res.status === 404) console.log('404 means the feature is not enabled on that server (check the three WHATSAPP_ variables).')
if (res.status === 401) console.log('401 means the signature did not match: the secret differs from the server\'s.')
