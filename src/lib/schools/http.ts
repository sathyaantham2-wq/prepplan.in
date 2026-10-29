import type { SignInResult } from './credentials'
import {
  BAD_CREDENTIALS,
  LOCKED_MESSAGE,
  MIN_PASSWORD_LENGTH,
} from './credentials'

/** The JSON a sign-in or activation endpoint answers with; success forwards the session cookies. */
export function signInResponse(result: SignInResult): Response {
  if (result.ok) {
    const headers = new Headers({
      'content-type': 'application/json',
      'cache-control': 'no-store',
    })
    for (const c of result.setCookies) headers.append('set-cookie', c)
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers })
  }
  const body =
    result.reason === 'locked'
      ? { error: 'locked', message: LOCKED_MESSAGE }
      : result.reason === 'weak_password'
        ? {
            error: 'weak_password',
            message: `Choose a password of at least ${MIN_PASSWORD_LENGTH} characters.`,
          }
        : { error: 'bad_credentials', message: BAD_CREDENTIALS }
  const status =
    result.reason === 'locked'
      ? 429
      : result.reason === 'weak_password'
        ? 400
        : 401
  return Response.json(body, {
    status,
    headers: { 'cache-control': 'no-store' },
  })
}

export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const body = (await request.json().catch(() => null)) as unknown
  return body && typeof body === 'object' && !Array.isArray(body)
    ? (body as Record<string, unknown>)
    : null
}
export const str = (v: unknown): string | null =>
  typeof v === 'string' && v.length > 0 && v.length < 500 ? v : null
