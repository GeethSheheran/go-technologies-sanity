import {cp, mkdir, readFile, rm, writeFile, access} from 'node:fs/promises'
import {fileURLToPath, URL} from 'node:url'
import console from 'node:console'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const source = path.join(root, 'dist')
const output = path.join(root, '.vercel/output')
const mount = '/studio'
let html = await readFile(path.join(source, 'index.html'), 'utf8')
// Sanity 6.23 prefixes modules/import maps but emits root-relative icon and
// manifest links. Normalize those generated head links for this deployment.
html = html.replace(/(<link\b[^>]*\bhref=["'])\/static\//g, `$1${mount}/static/`)
if (!html.includes('src="/studio/static/sanity-')) {
  throw new Error('Studio was not built for /studio. Check SANITY_STUDIO_BASEPATH overrides.')
}
// Clean only this service's generated output, never project-link metadata.
await rm(output, {recursive: true, force: true})
await mkdir(path.join(output, 'static', 'studio'), {recursive: true})
await cp(source, path.join(output, 'static', 'studio'), {recursive: true})
await writeFile(path.join(output, 'static', 'studio', 'index.html'), html)

// Check every local reference emitted in HTML, including the import-map vendor
// modules. A missing file must fail the build rather than become a blank screen.
const references = new Set([...html.matchAll(/["'](\/studio\/[^"'<>\s]+)["']/g)].map((m) => m[1]))
for (const reference of references) {
  await access(path.join(output, 'static', decodeURIComponent(reference.split(/[?#]/)[0])))
}
const config = {
  version: 3,
  routes: [
    {handle: 'filesystem'},
    // Never serve SPA HTML for a missing asset, even when the request's Accept
    // header is */*. That was the source of the production module MIME error.
    {src: '/studio/(?:static|vendor)(?:/.*)?', status: 404},
    {src: '/studio/.*\\.(?:js|mjs|css|map|json|webmanifest|ico|png|svg|woff|woff2)$', status: 404},
    {src: '/studio(?:/.*)?', dest: '/studio/index.html'},
  ],
}
await writeFile(path.join(output, 'config.json'), JSON.stringify(config, null, 2) + '\n')
console.log(`Packaged Studio at /studio; verified ${references.size} HTML asset references.`)
