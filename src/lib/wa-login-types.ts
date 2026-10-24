// "Continue with WhatsApp" sign-in: the contract between the server (better-auth plugin endpoints,
// the Meta webhook) and the browser. Types and tiny constants only: no imports, browser-safe.
//
// How it works (nobody types a code): the browser asks for a challenge, the student taps a
// wa.me link that opens WhatsApp with the message "PREPPLAN <code>" already typed, she presses
// Send, Meta calls our webhook with her phone number and that text, and the browser (which holds
// a private poll token) is signed in. The number is proven because the message really came from it.

/** Characters of a challenge code: no 0/O/1/I/L, so it can be read aloud or copied by hand. */
export const WA_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const WA_CODE_LENGTH = 8
/** The word every sign-in message starts with. The webhook ignores any message without it. */
export const WA_MESSAGE_KEYWORD = 'PREPPLAN'
/** Text the student sends, e.g. "PREPPLAN K7M2XQ9A". */
export const waMessageText = (code: string) => `${WA_MESSAGE_KEYWORD} ${code}`

/** GET /api/auth/whatsapp/config -- public. When `enabled` is false the button is hidden. */
export interface WaConfigResponse {
  enabled: boolean
  /** The business number for display and the copy fallback, e.g. "+91 98765 43210". */
  business_number_display: string | null
}

/**
 * POST /api/auth/whatsapp/start -- public for 'signin', needs a signed-in student for 'link'.
 * Body: { purpose: 'signin' | 'link' }.
 */
export interface WaStartResponse {
  challenge_id: string
  /** Shown to the student as a fallback ("send this message yourself"). */
  code: string
  message_text: string
  /** https://wa.me/<business number>?text=<message_text, URL-encoded> */
  wa_url: string
  /** Private to this browser; needed for every poll. Never put it in a URL. */
  poll_token: string
  /** ISO timestamp; challenges last 10 minutes. */
  expires_at: string
}

/** POST /api/auth/whatsapp/poll. Body: { challenge_id, poll_token }. */
export type WaPollResponse =
  | { status: 'pending' }
  | { status: 'expired' }
  /** A session cookie has been set; the page should go to her Home. */
  | { status: 'signed_in'; is_new_account: false }
  /** First time for this number: show a short form, then call complete-signup. */
  | { status: 'needs_signup'; signup_ticket: string; phone_masked: string }
  /** 'link' purpose finished: the number is now attached to the signed-in student's account. */
  | { status: 'linked'; phone_masked: string }
  /** That number already belongs to another account (never says whose). */
  | { status: 'phone_in_use' }
  /** The number belongs to an account that may not use WhatsApp sign-in (not a student, or switched off). */
  | { status: 'not_allowed' }

/**
 * POST /api/auth/whatsapp/complete-signup. Body: { signup_ticket, name, consent: true }.
 * `consent` is the same declaration as the email sign-up form ("my parent or guardian agrees to
 * my using PrepPlan"); the server refuses without it. Creates a STUDENT account only.
 */
export interface WaCompleteSignupResponse {
  status: 'signed_in'
  is_new_account: true
}

/** GET /api/students/me/whatsapp -- the signed-in student's linked number, masked. */
export interface WaLinkStatusResponse {
  linked: boolean
  /** e.g. "+91 ••••• ••123"; null when not linked. */
  phone_masked: string | null
  /** False when removing it would leave her no other way to sign in (no password, no Google). */
  can_unlink: boolean
}
