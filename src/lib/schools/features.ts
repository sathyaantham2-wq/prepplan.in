import { isProductionRuntime } from '../fixture-subjects'
import { SchoolError } from './common'

/**
 * Printed answer booklets and QR-code page sorting are switched OFF (owner decision 2026-11-03): a school's question
 * paper carries questions only, students write on the school's own answer sheets, and AI correction takes each
 * student's pages one student at a time. The code is kept so it can be revived; nothing reaches users while it is off.
 *
 * It is on only when SCHOOL_BOOKLETS=on, and never in a production runtime, so the dormant code keeps its own tests.
 */
export function bookletsEnabled(): boolean {
  return process.env.SCHOOL_BOOKLETS === 'on' && !isProductionRuntime()
}

export const BOOKLETS_OFF =
  'Answer booklets and QR codes are switched off. Students write on your school’s own answer sheets; upload each student’s pages under her name.'

/** Refuses a booklet, cover-page or QR-sorting request while the feature is off. */
export function assertBookletsEnabled(): void {
  if (!bookletsEnabled()) throw new SchoolError('forbidden', BOOKLETS_OFF)
}
