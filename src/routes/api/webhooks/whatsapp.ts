import { createFileRoute } from '@tanstack/react-router'
import { getSharedDb } from '../../../db/connection'
import { wrapRouteHandlers } from '../../../lib/error-log'
import {
  getWaConfig,
  processWhatsAppWebhook,
  verifyMetaSignature,
} from '../../../lib/wa-login'

// Meta's WhatsApp Cloud API webhook for "Continue with WhatsApp" sign-in. No session: Meta calls
// it, and trust comes from the HMAC signature over the raw body. 404 until the feature is
// configured (src/lib/wa-login.ts getWaConfig).
export const Route = createFileRoute('/api/webhooks/whatsapp')({
  server: {
    handlers: {
      // Meta's one-time handshake when the webhook is saved in the app dashboard.
      GET: async ({ request }: { request: Request }) => {
        const config = getWaConfig()
        if (!config) return new Response(null, { status: 404 })
        const url = new URL(request.url)
        const challenge = url.searchParams.get('hub.challenge')
        if (
          url.searchParams.get('hub.mode') === 'subscribe' &&
          url.searchParams.get('hub.verify_token') === config.verifyToken &&
          challenge !== null
        ) {
          return new Response(challenge, {
            status: 200,
            headers: { 'content-type': 'text/plain' },
          })
        }
        return new Response(null, { status: 403 })
      },
      POST: async ({ request }: { request: Request }) => {
        const config = getWaConfig()
        if (!config) return new Response(null, { status: 404 })
        // The raw text, not parsed JSON: the signature covers the exact bytes Meta sent.
        const raw = await request.text()
        if (
          !verifyMetaSignature(
            raw,
            request.headers.get('x-hub-signature-256'),
            config.appSecret,
          )
        ) {
          return new Response(null, { status: 401 })
        }
        let payload: unknown
        try {
          payload = JSON.parse(raw)
        } catch {
          return new Response(null, { status: 200 })
        }
        await processWhatsAppWebhook(getSharedDb(), config, payload)
        return new Response(null, { status: 200 })
      },
    },
  },
})

wrapRouteHandlers(Route, '/api/webhooks/whatsapp', ['GET', 'POST'])
