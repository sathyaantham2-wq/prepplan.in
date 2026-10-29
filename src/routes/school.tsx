import { Outlet, createFileRoute } from '@tanstack/react-router'

// The school area: its own calm look (styles.css, data-school-area) and no sounds, nothing shared with the personal PrepPlan
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
      data-school-area
      className="relative z-10 min-h-screen bg-[#f5f6f8] text-slate-900"
    >
      <Outlet />
    </div>
  )
}
