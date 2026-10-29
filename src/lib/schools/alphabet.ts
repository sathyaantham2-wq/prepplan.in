/**
 * The characters PrepPlan generates for anything a person has to read from paper and type:
 * one-time codes and the permanent IDs made for students without an admission number.
 * Left out on purpose: 0 and O, 1 and I and L (look-alikes in most printed fonts). Upper case only.
 * Admission numbers a school writes itself are kept exactly as the school wrote them.
 */
export const UNAMBIGUOUS_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

/** A regex class that matches exactly those characters, for tests and validation. */
export const UNAMBIGUOUS_CLASS = '[2-9A-HJKMNP-Z]'
