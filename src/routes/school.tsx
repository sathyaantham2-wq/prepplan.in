import { Outlet, createFileRoute } from '@tanstack/react-router'

// The school area: its own plain look and no sounds, nothing shared with the personal PrepPlan
// screens. The cover below sits over the personal theme's decorative background.
export const Route = createFileRoute('/school')({
  head: () => ({
    meta: [
      { title: 'PrepPlan for Schools' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: SchoolArea,
})

function SchoolArea() {
  return (
    <div
      data-no-sound
      className="relative z-10 min-h-screen bg-stone-50 text-slate-900 [&_a]:text-emerald-900!"
      style={{
        fontFamily:
          'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      }}
    >
      <Outlet />
    </div>
  )
}
