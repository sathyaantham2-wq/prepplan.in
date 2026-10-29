import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { env } from './env'
import { isProductionRuntime } from './fixture-subjects'

// Where the school's scanned pages live. Image bytes are NEVER stored in Postgres: the database rows
// keep only metadata and the storage key. Every file is sealed with AES-256-GCM by the app
// (src/lib/scan-crypto.ts) before it is handed to a store, so the store only ever holds ciphertext.
//
// Stores:
//   SupabaseScanStore  production: a PRIVATE Supabase Storage bucket, server-side service key only.
//   MemoryScanStore    every automated test (never touches the network or the disk).
//   DiskScanStore      local development and the browser tests: a folder on this machine.
// In a production runtime with no Supabase settings, uploads are refused (never written elsewhere).

export interface ScanStore {
  put: (key: string, bytes: Buffer) => Promise<void>
  /** null when there is no such file. */
  get: (key: string) => Promise<Buffer | null>
  /** Removing a file that is not there is not an error. */
  remove: (key: string) => Promise<void>
}

/** Path of a stored file: per school, then exam, then page. Contains no name or other personal detail. */
export const scanKey = (
  schoolId: string,
  examId: string,
  pageId: string,
  kind: 'original' | 'straightened',
) => `${schoolId}/${examId}/${pageId}/${kind}.bin`

/** A booklet print job's files (names and IDs are printed on them, so they are sealed too). */
export const printKey = (
  schoolId: string,
  examId: string,
  jobId: string,
  what: 'result' | `part-${number}`,
) => `${schoolId}/${examId}/_print/${jobId}/${what}.bin`

/** A piece of a file still being uploaded; removed when the pieces are joined. */
export const chunkKey = (schoolId: string, uploadId: string, seq: number) =>
  `${schoolId}/_chunks/${uploadId}/${seq}.bin`

export class MemoryScanStore implements ScanStore {
  readonly files = new Map<string, Buffer>()
  put(key: string, bytes: Buffer) {
    this.files.set(key, Buffer.from(bytes))
    return Promise.resolve()
  }
  get(key: string) {
    const b = this.files.get(key)
    return Promise.resolve(b ? Buffer.from(b) : null)
  }
  remove(key: string) {
    this.files.delete(key)
    return Promise.resolve()
  }
}

export class DiskScanStore implements ScanStore {
  constructor(private readonly dir: string) {}
  private path(key: string) {
    const full = resolve(join(this.dir, key))
    if (!full.startsWith(resolve(this.dir) + '/'))
      throw new Error('Bad storage key')
    return full
  }
  async put(key: string, bytes: Buffer) {
    const p = this.path(key)
    await mkdir(dirname(p), { recursive: true })
    await writeFile(p, bytes)
  }
  async get(key: string) {
    try {
      return await readFile(this.path(key))
    } catch {
      return null
    }
  }
  async remove(key: string) {
    await rm(this.path(key), { force: true })
  }
}

/**
 * Supabase Storage over its REST API, with the project's service key (server only: it must never be
 * sent to a browser). Errors carry the HTTP status but never the key, the URL or the file name.
 */
export class SupabaseScanStore implements ScanStore {
  constructor(
    private readonly url: string,
    private readonly serviceKey: string,
    private readonly bucket: string,
    private readonly doFetch: typeof fetch = fetch,
  ) {}
  private target(key: string, authenticated = false) {
    const path = key.split('/').map(encodeURIComponent).join('/')
    return `${this.url.replace(/\/+$/, '')}/storage/v1/object/${authenticated ? 'authenticated/' : ''}${encodeURIComponent(this.bucket)}/${path}`
  }
  private headers(extra: Record<string, string> = {}) {
    return {
      authorization: `Bearer ${this.serviceKey}`,
      apikey: this.serviceKey,
      ...extra,
    }
  }
  async put(key: string, bytes: Buffer) {
    const res = await this.doFetch(this.target(key), {
      method: 'POST',
      headers: this.headers({
        'content-type': 'application/octet-stream',
        'x-upsert': 'true',
        'cache-control': 'no-store',
      }),
      body: new Uint8Array(bytes),
    })
    if (!res.ok)
      throw new Error(`Scan storage refused the upload (${res.status})`)
  }
  async get(key: string) {
    const res = await this.doFetch(this.target(key, true), {
      method: 'GET',
      headers: this.headers(),
    })
    if (res.status === 404 || res.status === 400) return null
    if (!res.ok)
      throw new Error(`Scan storage could not be read (${res.status})`)
    return Buffer.from(await res.arrayBuffer())
  }
  async remove(key: string) {
    const res = await this.doFetch(this.target(key), {
      method: 'DELETE',
      headers: this.headers(),
    })
    if (!res.ok && res.status !== 404)
      throw new Error(`Scan storage could not delete a file (${res.status})`)
  }
}

let override: ScanStore | null = null
let memory: MemoryScanStore | null = null
let disk: DiskScanStore | null = null

/** Tests: use this store instead of any other (null puts the normal choice back). */
export function setScanStoreForTests(store: ScanStore | null) {
  override = store
}

export class ScanStorageNotConfigured extends Error {
  constructor() {
    super('Scan storage is not set up')
  }
}

/** Which kind of store applies. Pure, so every case can be tested without any environment. */
export function chooseScanStoreKind(o: {
  testRun: boolean
  supabaseConfigured: boolean
  production: boolean
}): 'memory' | 'supabase' | 'disk' | 'none' {
  if (o.testRun) return 'memory' // automated tests never reach real storage, whatever else is set
  if (o.supabaseConfigured) return 'supabase'
  return o.production ? 'none' : 'disk'
}

export function getScanStore(): ScanStore {
  if (override) return override
  const kind = chooseScanStoreKind({
    testRun: Boolean(process.env.VITEST) || process.env.NODE_ENV === 'test',
    supabaseConfigured: Boolean(
      env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
    ),
    production: isProductionRuntime(),
  })
  if (kind === 'memory') return (memory ??= new MemoryScanStore())
  if (kind === 'supabase')
    return new SupabaseScanStore(
      env.SUPABASE_URL as string,
      env.SUPABASE_SERVICE_ROLE_KEY as string,
      env.SCAN_BUCKET ?? 'school-scans',
    )
  if (kind === 'none') throw new ScanStorageNotConfigured()
  return (disk ??= new DiskScanStore(join(process.cwd(), '.scan-storage')))
}

/** A school's own question paper (or its answer key) as uploaded, sealed; kept for the life of the paper. */
export const ownPaperKey = (schoolId: string, paperId: string, kind: 'paper' | 'key', n: number) =>
  `${schoolId}/_own/${paperId}/${kind}-${n}.bin`
