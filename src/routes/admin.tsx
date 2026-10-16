import { useEffect } from 'react'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AdminShell } from '../components/admin/admin-shell'
import { PageLoading } from '../components/page-loading'
import { useSession } from '../lib/auth-client'

export const Route = createFileRoute('/admin')({ component: AdminLayout })

/**
 * Layout of every /admin/* screen (2026-10-16): admin-only frame with its own navigation. Anyone who
 * is not an admin is sent to the sign-in page; each API behind these screens still enforces the
 * admin role on the server.
 */
function AdminLayout() {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()
  const role = (session?.user as { role?: string } | undefined)?.role

  useEffect(() => {
    if (isPending) return
    if (!session || role !== 'admin') void navigate({ to: '/' })
  }, [isPending, session, role, navigate])

  if (isPending || !session || role !== 'admin') return <PageLoading />
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  )
}
