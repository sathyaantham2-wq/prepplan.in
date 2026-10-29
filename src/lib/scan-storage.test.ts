import { mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  DiskScanStore,
  MemoryScanStore,
  ScanStorageNotConfigured,
  SupabaseScanStore,
  chooseScanStoreKind,
  chunkKey,
  getScanStore,
  scanKey,
} from './scan-storage'

const SCHOOL = '5c3f0000-0000-4000-8000-000000000001'

describe('which store is used', () => {
  it('tests always get the in-memory stand-in, even with storage settings present', () => {
    expect(getScanStore()).toBeInstanceOf(MemoryScanStore)
    expect(
      chooseScanStoreKind({
        testRun: true,
        supabaseConfigured: true,
        production: true,
      }),
    ).toBe('memory')
  })
  it('production with the Supabase settings uses Supabase; without them it refuses (never a disk)', () => {
    expect(
      chooseScanStoreKind({
        testRun: false,
        supabaseConfigured: true,
        production: true,
      }),
    ).toBe('supabase')
    expect(
      chooseScanStoreKind({
        testRun: false,
        supabaseConfigured: false,
        production: true,
      }),
    ).toBe('none')
  })
  it('local development without settings uses a folder on this machine', () => {
    expect(
      chooseScanStoreKind({
        testRun: false,
        supabaseConfigured: false,
        production: false,
      }),
    ).toBe('disk')
  })
  it('keys are per school, exam and page and carry no personal detail', () => {
    expect(scanKey(SCHOOL, 'e1', 'p1', 'original')).toBe(
      `${SCHOOL}/e1/p1/original.bin`,
    )
    expect(chunkKey(SCHOOL, 'u1', 2)).toBe(`${SCHOOL}/_chunks/u1/2.bin`)
  })
})

describe('Supabase store (talks to a fake fetch, never the network)', () => {
  const calls: Array<{ url: string; init: RequestInit }> = []
  const files = new Map<string, Uint8Array>()
  const fake: typeof fetch = (url, init) => {
    calls.push({ url: String(url), init: init ?? {} })
    const key = String(url).replace(/^.*\/object\/(authenticated\/)?/, '')
    if (init?.method === 'POST') {
      files.set(key, init.body as Uint8Array)
      return Promise.resolve(new Response('{}', { status: 200 }))
    }
    if (init?.method === 'DELETE') {
      const had = files.delete(key)
      return Promise.resolve(new Response('{}', { status: had ? 200 : 404 }))
    }
    const f = files.get(key)
    return Promise.resolve(
      f
        ? new Response(f as BodyInit, { status: 200 })
        : new Response('{}', { status: 404 }),
    )
  }
  const store = new SupabaseScanStore(
    'https://proj.supabase.co/',
    'SERVICE-KEY-123',
    'school-scans',
    fake,
  )

  it('puts, gets and removes a file in the private bucket with the service key', async () => {
    await store.put(`${SCHOOL}/e1/p1/original.bin`, Buffer.from('sealed bytes'))
    expect(calls[0].url).toBe(
      `https://proj.supabase.co/storage/v1/object/school-scans/${SCHOOL}/e1/p1/original.bin`,
    )
    expect(calls[0].init.method).toBe('POST')
    const h = calls[0].init.headers as Record<string, string>
    expect(h.authorization).toBe('Bearer SERVICE-KEY-123')
    expect(h['x-upsert']).toBe('true')
    expect((await store.get(`${SCHOOL}/e1/p1/original.bin`))!.toString()).toBe(
      'sealed bytes',
    )
    expect(calls[1].url).toContain(
      '/storage/v1/object/authenticated/school-scans/',
    ) // a private-bucket read, never a public URL
    await store.remove(`${SCHOOL}/e1/p1/original.bin`)
    expect(await store.get(`${SCHOOL}/e1/p1/original.bin`)).toBeNull()
    await expect(store.remove('nothing/here')).resolves.toBeUndefined() // deleting what is not there is fine
  })

  it('an error mentions the status only: never the key, the file name or the URL', async () => {
    const failing = new SupabaseScanStore(
      'https://proj.supabase.co',
      'SERVICE-KEY-123',
      'school-scans',
      () => Promise.resolve(new Response('{}', { status: 500 })),
    )
    const e = await failing
      .put(`${SCHOOL}/e1/p1/original.bin`, Buffer.from('x'))
      .catch((err: Error) => err)
    expect((e as Error).message).toMatch(/\(500\)/)
    expect((e as Error).message).not.toContain('SERVICE-KEY')
    expect((e as Error).message).not.toContain(SCHOOL)
    expect((e as Error).message).not.toContain('supabase.co')
  })
})

describe('disk store (local development)', () => {
  it('writes inside its own folder only', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'scan-store-'))
    const store = new DiskScanStore(dir)
    await store.put('a/b/c.bin', Buffer.from('hello'))
    expect((await store.get('a/b/c.bin'))!.toString()).toBe('hello')
    expect(await store.get('a/b/missing.bin')).toBeNull()
    await expect(store.put('../escape.bin', Buffer.from('x'))).rejects.toThrow(
      /Bad storage key/,
    )
    await store.remove('a/b/c.bin')
    expect(await store.get('a/b/c.bin')).toBeNull()
    expect(readdirSync(dir)).toEqual(['a'])
  })
})

describe('a deployment without file storage refuses plainly, before anything is saved', () => {
  it('turns "not set up" into a sentence for the person, and leaves other errors alone', async () => {
    const { SchoolError, storageOrRefuse } = await import('./schools/common')
    expect(() =>
      storageOrRefuse(() => {
        throw new ScanStorageNotConfigured()
      }),
    ).toThrow(SchoolError)
    expect(() =>
      storageOrRefuse(() => {
        throw new ScanStorageNotConfigured()
      }),
    ).toThrow(/File storage is not switched on yet/)
    expect(() =>
      storageOrRefuse(() => {
        throw new Error('something else')
      }),
    ).toThrow('something else')
    expect(storageOrRefuse(() => 5)).toBe(5)
  })
})
