import {
  CANVAS_SCHEMA_VERSION,
  type CanvasSchema
} from '@amg-webui/utils'
import { migrateCanvasSchema } from '../validate'
import {
  createEmptyDocument,
  LOWCODE_DOCUMENT_VERSION,
  type LowcodeDocument
} from './types'
import type { DataSourceDef, LowcodeAction } from '../runtime'

export {
  createEmptyDocument,
  documentToSchema,
  LOWCODE_DOCUMENT_VERSION,
  type LowcodeDocument
} from './types'

export function schemaToDocument(
  schema: CanvasSchema,
  base?: Partial<LowcodeDocument>
): LowcodeDocument {
  const now = new Date().toISOString()
  return {
    ...createEmptyDocument(base?.name ?? 'Untitled'),
    ...base,
    schemaVersion: schema.version,
    page: { mode: schema.mode, breakpoint: base?.page?.breakpoint ?? 'pc' },
    nodes: schema.nodes,
    updatedAt: now,
    createdAt: base?.createdAt ?? now
  }
}

export function migrateLowcodeDocument(input: unknown): LowcodeDocument {
  if (!input || typeof input !== 'object') return createEmptyDocument()
  const raw = input as Partial<LowcodeDocument> & { nodes?: unknown; version?: number }

  if (!('dataSources' in raw) && Array.isArray(raw.nodes) && 'mode' in (raw as object)) {
    const schema = migrateCanvasSchema(raw)
    return schemaToDocument(schema, { name: 'Imported' })
  }

  const schema = migrateCanvasSchema({
    version: raw.schemaVersion ?? CANVAS_SCHEMA_VERSION,
    mode: raw.page?.mode ?? 'free',
    nodes: raw.nodes ?? []
  })

  const now = new Date().toISOString()
  return {
    id: typeof raw.id === 'string' ? raw.id : `doc-${Date.now().toString(36)}`,
    name: typeof raw.name === 'string' ? raw.name : 'Untitled',
    version: typeof raw.version === 'number' ? raw.version : LOWCODE_DOCUMENT_VERSION,
    schemaVersion: schema.version,
    page: {
      mode: schema.mode,
      breakpoint: raw.page?.breakpoint ?? 'pc'
    },
    nodes: schema.nodes,
    variables:
      raw.variables && typeof raw.variables === 'object' ? { ...raw.variables } : {},
    dataSources: Array.isArray(raw.dataSources) ? ([...raw.dataSources] as DataSourceDef[]) : [],
    actions: raw.actions && typeof raw.actions === 'object' ? { ...(raw.actions as Record<string, LowcodeAction[]>) } : {},
    theme: raw.theme,
    permissions: raw.permissions && typeof raw.permissions === 'object' ? { ...raw.permissions } : {},
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : now,
    updatedAt: now
  }
}

const STORAGE_PREFIX = 'amg-lowcode-studio-doc:'

export function saveDocumentLocal(doc: LowcodeDocument, key = 'draft'): void {
  if (typeof localStorage === 'undefined') return
  const next = { ...doc, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(next))
}

export function loadDocumentLocal(key = 'draft'): LowcodeDocument | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_PREFIX + key)
  if (!raw) return null
  try {
    return migrateLowcodeDocument(JSON.parse(raw))
  } catch {
    return null
  }
}

export function exportDocumentJson(doc: LowcodeDocument): string {
  return JSON.stringify(doc, null, 2)
}

export function importDocumentJson(text: string): LowcodeDocument {
  return migrateLowcodeDocument(JSON.parse(text))
}

export function listDocumentKeys(): string[] {
  if (typeof localStorage === 'undefined') return []
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith(STORAGE_PREFIX)) keys.push(k.slice(STORAGE_PREFIX.length))
  }
  return keys
}

export { createUserManagementTemplate } from './templates/userManagement'
