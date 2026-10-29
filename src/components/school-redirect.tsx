import { useEffect } from 'react'
import { useSession } from '../lib/auth-client'

// Pages a school login may see besides its own area.
const ALLOWED_PREFIXES = ['/school', '/privacy', '/about', '/delete-account']

/**
 * A school login belongs in the school area only. If one lands anywhere on the personal PrepPlan
 * screens (a saved link, the home page), send it to /school. The data behind those screens is
 * refused by the server anyway (requireUser); this just keeps the person from seeing an empty,
 * confusing app.
 */
export function SchoolRedirect() {
  const { data: session } = useSession()
  const isSchool =
    (session?.user as { signup_type?: string } | undefined)?.signup_type ===
    'school'
  useEffect(() => {
    if (!isSchool) return
    const path = window.location.pathname
    if (!ALLOWED_PREFIXES.some((p) => path === p || path.startsWith(p + '/')))
      window.location.replace('/school')
  }, [isSchool])
  return null
}
