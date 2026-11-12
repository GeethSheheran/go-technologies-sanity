import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {isDeepStrictEqual} from 'node:util'
import {getCliClient} from 'sanity/cli'
import original from '../../src/sanity/original.json'
import catalog from '../../src/sanity/catalog.json'

const root = path.resolve(process.cwd(), '..')
const client = getCliClient({apiVersion: '2025-02-19'}).withConfig({
  useCdn: false,
  perspective: 'raw',
})
const write = process.env.SANITY_MIGRATE_WRITE === '1'
function decorate(value: unknown): unknown {
  if (Array.isArray(value))
    return value.map((item, index) =>
      item && typeof item === 'object'
        ? {
            ...(decorate(item) as object),
            _type: 'entry',
            _key: `item-${String(index).padStart(3, '0')}`,
          }
        : item,
    )
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decorate(v)]))
  return value
}
function clean(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !k.startsWith('_') && k !== 'image')
        .map(([k, v]) => [k, clean(v)]),
    )
  return value
}
async function upload(value: unknown): Promise<void> {
  if (!value || typeof value !== 'object') return
  const object = value as Record<string, unknown>
  if (typeof object.src === 'string') {
    const bytes = fs.readFileSync(path.join(root, 'public', object.src))
    const asset = await client.assets.upload('image', bytes, {filename: path.basename(object.src)})
    if (asset.sha1hash !== createHash('sha1').update(bytes).digest('hex'))
      throw Error(`Image mismatch: ${object.src}`)
    object.image = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
  }
  for (const [key, v] of Object.entries(object)) if (key !== 'image') await upload(v)
}
const results = []
for (const entry of catalog) {
  const source = entry.path.reduce(
    (v, key) => (v as Record<string, unknown>)[key],
    original as unknown,
  )
  const expected = entry.type === 'hero' ? {hero: source} : source
  const existing = await client.fetch('*[_id in $ids]{_id}', {
    ids: [entry.id, `drafts.${entry.id}`],
  })
  let status = 'dry-run'
  if (existing.length) status = 'skipped-existing'
  else if (write) {
    const doc = {...(decorate(expected) as object), _id: entry.id, _type: entry.type}
    await upload(doc)
    await client.createIfNotExists(doc)
    status = 'created'
  }
  const published = await client.getDocument(entry.id)
  const exact = published ? isDeepStrictEqual(clean(published), clean(expected)) : false
  const imageChecks: boolean[] = []
  async function verifyImages(v: unknown): Promise<void> {
    if (!v || typeof v !== 'object') return
    const o = v as Record<string, unknown>
    if (typeof o.src === 'string') {
      const ref = (o.image as {asset?: {_ref?: string}} | undefined)?.asset?._ref
      const asset = ref ? await client.getDocument(ref) : undefined
      imageChecks.push(
        asset?.sha1hash ===
          createHash('sha1')
            .update(fs.readFileSync(path.join(root, 'public', o.src)))
            .digest('hex'),
      )
    }
    for (const [k, item] of Object.entries(o)) if (k !== 'image') await verifyImages(item)
  }
  if (published) await verifyImages(published)
  results.push({
    id: entry.id,
    status,
    contentMatches: exact,
    imagesMatch: imageChecks.every(Boolean),
    imagesChecked: imageChecks.length,
  })
  console.log(entry.title, status, exact ? 'verified' : 'not verified')
}
const report = {
  generatedAt: new Date().toISOString(),
  project: 'pk1w379x',
  dataset: 'production',
  mode: write ? 'create-if-missing' : 'read-only',
  results,
  verified: results.every((r) => r.contentMatches && r.imagesMatch),
}
fs.writeFileSync(
  path.join(root, 'docs/sanity/migration-report.json'),
  JSON.stringify(report, null, 2) + '\n',
)
if (write && !report.verified)
  throw Error('Migration verification failed; see report. Do not activate CMS content.')
