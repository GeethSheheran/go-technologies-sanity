import {defineType, type FieldDefinition, type Rule} from 'sanity'
import original from '../../src/sanity/original.json'
import catalog from '../../src/sanity/catalog.json'

const labels: Record<string, string> = {
  hero: 'Hero',
  body: 'Description',
  href: 'Destination',
  src: 'Original image path',
  alt: 'Alternative text',
  seo: 'SEO metadata',
  updatedIso: 'Last updated date',
  variant: 'Avatar association',
  router: 'Audience Navigation',
}
const label = (key: string) =>
  labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
const safeLink = (value: unknown) =>
  typeof value !== 'string' ||
  (/^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(value) && !/[\s\\\u0000-\u001f]/.test(value)) ||
  'Use an https URL, /page, #section, mailto: or tel: link.'
function fields(samples: Record<string, unknown>[], path: string): FieldDefinition[] {
  const merged = Object.assign({}, ...samples) as Record<string, unknown>
  const result = Object.entries(merged).map(([name, value]): FieldDefinition => {
    const full = `${path}.${name}`
    const block = path.endsWith('.blocks')
    const technical = [
      'id',
      'variant',
      'src',
      'position',
      'type',
      'width',
      'height',
      'metadataBase',
      'index',
      'follow',
      'card',
    ].includes(name)
    const base = {
      name,
      title: label(name),
      readOnly:
        block && name === 'type'
          ? false
          : name === 'id'
            ? ({value}: {value?: string}) => Boolean(value)
            : technical,
      description: technical
        ? 'Preserved to keep existing links, layout and design working.'
        : undefined,
    }
    if (Array.isArray(value)) {
      const all = samples.flatMap((s) => (Array.isArray(s[name]) ? (s[name] as unknown[]) : []))
      const objects = all.filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
      const count =
        full === 'principles.items' || full === 'partnerships.items'
          ? 4
          : full === 'router.items'
            ? 3
            : full === 'product.journeys' || full === 'settings.images.journeys'
              ? 5
              : undefined
      return {
        ...base,
        type: 'array',
        of: objects.length
          ? [
              {
                type: 'object',
                name: 'entry',
                initialValue: full.endsWith('.blocks') ? {type: 'paragraph'} : undefined,
                fields: fields(objects, full),
                preview: {
                  select: {title: 'title', label: 'label', text: 'text'},
                  prepare: ({title, label, text}) => ({title: title || label || text || 'Entry'}),
                },
              },
            ]
          : [{type: 'string'}],
        options: {sortable: !full.endsWith('.journeys')},
        validation: (r: Rule) => (count ? r.required().length(count) : r),
        hidden: block
          ? ({parent}) =>
              name === 'items'
                ? parent?.type !== 'list'
                : name === 'lines'
                  ? parent?.type !== 'contact'
                  : false
          : undefined,
      } as FieldDefinition
    }
    if (value && typeof value === 'object')
      return {
        ...base,
        type: 'object',
        fields: fields(
          samples.map((s) => s[name]).filter((v) => v && typeof v === 'object') as Record<
            string,
            unknown
          >[],
          full,
        ),
      } as FieldDefinition
    if (typeof value === 'boolean') return {...base, type: 'boolean'} as FieldDefinition
    if (typeof value === 'number')
      return {...base, type: 'number', validation: (r: Rule) => r.required()} as FieldDefinition
    const link =
      ['href', 'creditHref', 'canonical', 'url'].includes(name) || path === 'settings.destinations'
    return {
      ...base,
      type:
        name === 'updatedIso'
          ? 'date'
          : typeof value === 'string' && value.length > 120
            ? 'text'
            : 'string',
      options:
        block && name === 'type' ? {list: ['paragraph', 'heading', 'list', 'contact']} : undefined,
      rows: typeof value === 'string' && value.length > 120 ? 4 : undefined,
      description:
        full === 'hero.title'
          ? 'Edit the complete heading. End with “Go.” to preserve its highlighted brand treatment. Preview the two-line heading before deployment.'
          : base.description,
      hidden:
        block && name === 'text'
          ? ({parent}) => !['heading', 'paragraph'].includes(parent?.type)
          : undefined,
      validation: (r: Rule) => {
        if (name === 'updatedIso') return r.required()
        if (link) return r.required().custom(safeLink)
        if (full === 'hero.title')
          return r
            .required()
            .max(65)
            .regex(/^.+\sGo\.$/, {name: 'heading ending in Go.'})
        if (name === 'id') return r.required().regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/)
        if (block && name === 'type') return r.required()
        if (block) return r
        return r.required().max(name.toLowerCase().includes('title') ? 160 : 5000)
      },
    } as FieldDefinition
  })
  if ('src' in merged)
    result.push({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Replace the photo here. Keep a similar aspect ratio.',
      validation: (r: Rule) => r.required(),
    })
  return result
}
export const schemaTypes = catalog.map((entry) => {
  const value = entry.path.reduce(
    (v, key) => (v as Record<string, unknown>)[key],
    original as unknown,
  ) as Record<string, unknown>
  return defineType({
    name: entry.type,
    title: entry.title,
    type: 'document',
    fields:
      entry.type === 'hero'
        ? [{name: 'hero', title: 'Hero', type: 'object', fields: fields([value], 'hero')}]
        : fields([value], entry.type),
    preview: {prepare: () => ({title: entry.title})},
  })
})
