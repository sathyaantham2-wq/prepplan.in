import { createContext, useContext } from 'react'
import type { SchoolOverview } from '../../lib/school-client'

export interface SchoolCtx {
  schoolId: string
  overview: SchoolOverview
  reload: () => Promise<void>
}
export const SchoolContext = createContext<SchoolCtx | null>(null)
export function useSchool(): SchoolCtx {
  const c = useContext(SchoolContext)
  if (!c) throw new Error('useSchool outside the school layout')
  return c
}
