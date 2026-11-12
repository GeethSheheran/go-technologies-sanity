import assert from 'node:assert/strict'
import {access, readFile, stat} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath, URL} from 'node:url'
import console from 'node:console'

export const output = fileURLToPath(new URL('../.vercel/output/', import.meta.url))
const config = JSON.parse(await readFile(path.join(output, 'config.json'), 'utf8'))
const project = JSON.parse(await readFile(new URL('../../vercel.json', import.meta.url), 'utf8'))
const staticRoot = path.join(output, 'static')
export async function resolveRoute(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const file = path.resolve(staticRoot, `.${pathname}`)
  if (!file.startsWith(staticRoot + path.sep)) return {status: 404}
  for (const route of config.routes) {
    if (route.handle === 'filesystem') {
      try {
        if ((await stat(file)).isFile()) return {status: 200, file}
      } catch {
        /* Continue routing. */
      }
    } else if (new RegExp(`^(?:${route.src})$`).test(pathname)) {
      return route.status
        ? {status: route.status}
        : {status: 200, file: path.join(staticRoot, route.dest)}
    }
  }
  return {status: 404}
}
const html = await readFile(path.join(staticRoot, 'studio/index.html'), 'utf8')
assert.equal(config.version, 3)
assert.equal(project.services.studio.buildCommand, 'npm run build:vercel')
for (const route of project.rewrites.filter((r) => r.destination.service === 'studio')) {
  assert.equal(route.destination.path, undefined, 'Do not strip the physical /studio namespace')
}
assert(!/(?:href|src)=["']\/static\//.test(html), 'Unprefixed head asset')
const urls = new Set([...html.matchAll(/["'](\/studio\/[^"'<>\s]+)["']/g)].map((m) => m[1]))
for (const url of urls) {
  const result = await resolveRoute(url)
  assert.equal(result.status, 200, url)
  assert(!result.file.endsWith('.html'), `HTML fallback for asset ${url}`)
  await access(result.file)
}
for (const url of ['/studio', '/studio/', '/studio/structure', '/studio/structure/website-hero']) {
  const result = await resolveRoute(url)
  assert.equal(result.status, 200, url)
  assert(result.file.endsWith('/studio/index.html'))
}
for (const url of [
  '/studio/static/missing.js',
  '/studio/vendor/missing.mjs',
  '/studio/static/missing.webmanifest',
  '/studio/missing.js',
  '/static/manifest.webmanifest',
  '/',
]) {
  assert.equal((await resolveRoute(url)).status, 404, url)
}
const manifest = JSON.parse(
  await readFile(path.join(staticRoot, 'studio/static/manifest.webmanifest'), 'utf8'),
)
for (const icon of manifest.icons)
  assert.equal((await resolveRoute(icon.src)).status, 200, icon.src)
console.log(
  `Studio artifact checks passed: ${urls.size} assets, manifest icons, deep links, missing-asset 404s, and service namespace.`,
)
