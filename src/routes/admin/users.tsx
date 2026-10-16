import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { useSession } from '../../lib/auth-client'
import { AdminPage, Notice, Panel, Pill } from '../../components/admin/admin-ui'

export const Route = createFileRoute('/admin/users')({ component: AdminUsers })

interface UserRow {
  id: string
  name: string
  email: string
  role: 'parent' | 'student' | 'admin'
  is_active: boolean
  email_verified: boolean
  created_at: string
}

/**
 * F083 (tab06 /admin/users): the last piece of the admin console's literal AC list ("Manage
 * ... users"). 'admin' here is a household member with an elevated role, not a cross-tenant
 * superadmin (promoteToAdmin only ever flips role, never household_id) -- so "users" means the
 * accounts within the admin's own household: the parent/admin account(s) and any student login
 * accounts. Deactivating one is enforced server-side in session.ts's getCurrentUser, not just a
 * hidden button, and every toggle is written to the audit log (F099).
 * The admin guard lives in the /admin layout route.
 */
function AdminUsers() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as { id?: string } | undefined)?.id

  const [users, setUsers] = useState<Array<UserRow> | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  function refresh() {
    fetch('/api/households/users')
      .then(async (r) => {
        if (!r.ok) throw new Error('Could not load users.')
        return r.json() as Promise<Array<UserRow>>
      })
      .then(setUsers)
      .catch((err: Error) => setLoadError(err.message))
  }

  useEffect(() => {
    refresh()
  }, [])

  async function toggleActive(user: UserRow) {
    setActionError(null)
    setPendingId(user.id)
    try {
      const response = await fetch(`/api/households/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active }),
      })
      const body = await response.json()
      if (!response.ok) {
        setActionError(body.error ?? 'Could not update that account.')
        return
      }
      refresh()
    } finally {
      setPendingId(null)
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (users ?? []).filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      if (roleFilter !== 'all' && u.role !== roleFilter) return false
      if (statusFilter === 'active' && !u.is_active) return false
      if (statusFilter === 'deactivated' && u.is_active) return false
      return true
    })
  }, [users, query, roleFilter, statusFilter])

  const selectCls = 'border-input bg-card h-9 rounded-md border px-3 text-sm shadow-xs'

  return (
    <AdminPage
      title="Users"
      description="Accounts in this household. Deactivating an account blocks it from signing in immediately, even from an existing session."
    >
      {loadError && <Notice tone="bad">{loadError}</Notice>}
      {actionError && <Notice tone="bad">{actionError}</Notice>}
      {!users && !loadError && <Notice>Loading users…</Notice>}

      {users && (
        <Panel
          title={`${filtered.length} of ${users.length} account${users.length === 1 ? '' : 's'}`}
          action={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
                <Input
                  aria-label="Search users"
                  placeholder="Search name or email"
                  className="w-56 pl-8"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select aria-label="Filter by role" className={selectCls} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All roles</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
                <option value="student">Student</option>
              </select>
              <select aria-label="Filter by status" className={selectCls} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
          }
        >
          <div className="-mx-4 overflow-x-auto sm:-mx-5">
            <table className="text-small w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="text-muted-foreground border-border border-b text-left">
                  <th className="field-label px-4 py-2 font-semibold sm:pl-5">User</th>
                  <th className="field-label px-4 py-2 font-semibold">Role</th>
                  <th className="field-label px-4 py-2 font-semibold">Status</th>
                  <th className="field-label px-4 py-2 font-semibold">Joined</th>
                  <th className="px-4 py-2 sm:pr-5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.id} className="border-border hover:bg-muted/50 border-t">
                    <td className="px-4 py-2.5 sm:pl-5">
                      <p className="font-medium">
                        {user.name}
                        {user.id === currentUserId && (
                          <span className="text-muted-foreground ml-2 font-normal">(you)</span>
                        )}
                      </p>
                      <p className="text-muted-foreground break-all">{user.email}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <Pill tone={user.role === 'admin' ? 'warn' : 'default'}>{user.role}</Pill>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        <Pill tone={user.is_active ? 'good' : 'bad'}>{user.is_active ? 'Active' : 'Deactivated'}</Pill>
                        {!user.email_verified && <Pill tone="warn">Unverified</Pill>}
                      </div>
                    </td>
                    <td className="text-muted-foreground px-4 py-2.5 whitespace-nowrap tabular-nums">
                      {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-2.5 text-right sm:pr-5">
                      <Button
                        size="sm"
                        variant={user.is_active ? 'outline' : 'default'}
                        disabled={pendingId === user.id}
                        onClick={() => void toggleActive(user)}
                      >
                        {user.is_active ? 'Deactivate' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-muted-foreground p-4 text-center">
                      {users.length === 0 ? 'No users found.' : 'No users match these filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </AdminPage>
  )
}
