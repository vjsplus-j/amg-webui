import { defineSkill } from '../core/runtime'
import type {
  DictMappingConfig,
  DictMappingResult,
  FormSubmitConfig,
  FormSubmitResult,
  RequestWrapperConfig,
  RequestWrapperResult,
  TableExportConfig,
  TableExportResult,
  TableSearchConfig,
  TableSearchResult
} from './types'

function escapeCsv(value: unknown): string {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function rowsToCsv(
  rows: unknown[],
  columns?: Array<{ field: string; header?: string }>
): string {
  if (!rows.length) return ''
  const sample = rows[0]
  const cols =
    columns?.length
      ? columns
      : typeof sample === 'object' && sample !== null
        ? Object.keys(sample as Record<string, unknown>).map((field) => ({
            field,
            header: field
          }))
        : [{ field: 'value', header: 'value' }]
  const header = cols.map((c) => escapeCsv(c.header ?? c.field)).join(',')
  const body = rows
    .map((row) => {
      const record =
        typeof row === 'object' && row !== null
          ? (row as Record<string, unknown>)
          : { value: row }
      return cols.map((c) => escapeCsv(record[c.field])).join(',')
    })
    .join('\n')
  return `${header}\n${body}`
}

/** Paginated keyword search via named Adapter (default `search`). */
export const tableSearchSkill = defineSkill<
  TableSearchConfig,
  TableSearchResult
>({
  name: 'table-search',
  async setup(ctx, config) {
    const keyword = config.keyword?.trim() ?? ''
    const page = Math.max(1, config.page ?? 1)
    const pageSize = Math.max(1, config.pageSize ?? 20)
    const adapter = config.adapter ?? 'search'
    const raw = await ctx.useAdapter<
      TableSearchConfig,
      Partial<TableSearchResult> & { list?: unknown[] }
    >(adapter, {
      ...config,
      keyword,
      page,
      pageSize
    })
    const list = Array.isArray(raw.list) ? raw.list : []
    const total =
      typeof raw.total === 'number' ? raw.total : list.length
    ctx.state.lastKeyword = keyword
    ctx.state.lastTotal = total
    ctx.emit('table-search:done', { keyword, total, page, pageSize })
    return {
      list,
      total,
      page: typeof raw.page === 'number' ? raw.page : page,
      pageSize: typeof raw.pageSize === 'number' ? raw.pageSize : pageSize,
      keyword
    }
  },
  teardown() {}
})

/** Map dictionary codes to labels via Adapter (default `dict`). */
export const dictMappingSkill = defineSkill<
  DictMappingConfig,
  DictMappingResult
>({
  name: 'dict-mapping',
  async setup(ctx, config) {
    const adapter = config.adapter ?? 'dict'
    const values = config.values ?? []
    const raw = await ctx.useAdapter<
      DictMappingConfig,
      { map?: Record<string, string> } | Record<string, string>
    >(adapter, config)
    let map: Record<string, string> = {}
    if (raw && typeof raw === 'object') {
      if ('map' in raw && raw.map && typeof raw.map === 'object') {
        map = raw.map as Record<string, string>
      } else {
        map = raw as Record<string, string>
      }
    }
    const labels = values.map((v) => map[String(v)] ?? String(v))
    ctx.state.dict = config.dict
    ctx.emit('dict-mapping:done', { dict: config.dict, count: labels.length })
    return { dict: config.dict, map, labels }
  },
  teardown() {}
})

/** Submit form values via Adapter (default `submit`). */
export const formSubmitSkill = defineSkill<FormSubmitConfig, FormSubmitResult>({
  name: 'form-submit',
  async setup(ctx, config) {
    if (config.validate !== false) {
      const values = config.values
      if (!values || typeof values !== 'object') {
        throw new Error('form-submit: values must be an object')
      }
    }
    const adapter = config.adapter ?? 'submit'
    const raw = await ctx.useAdapter<
      FormSubmitConfig,
      Partial<FormSubmitResult>
    >(adapter, config)
    const result: FormSubmitResult = {
      ok: raw.ok !== false,
      id: raw.id,
      values: raw.values ?? config.values
    }
    ctx.state.lastSubmitOk = result.ok
    ctx.emit('form-submit:done', result)
    return result
  },
  teardown() {}
})

/**
 * Serialize table rows to CSV/JSON.
 * If `adapter` is set, delegates to host download; otherwise returns content only.
 */
export const tableExportSkill = defineSkill<
  TableExportConfig,
  TableExportResult
>({
  name: 'table-export',
  async setup(ctx, config) {
    const format = config.format ?? 'csv'
    const filename =
      config.filename ??
      `export-${Date.now()}.${format === 'json' ? 'json' : 'csv'}`
    const content =
      format === 'json'
        ? JSON.stringify(config.rows, null, 2)
        : rowsToCsv(config.rows, config.columns)
    const result: TableExportResult = {
      format,
      filename,
      content,
      byteLength: typeof TextEncoder !== 'undefined'
        ? new TextEncoder().encode(content).length
        : content.length
    }
    if (config.adapter) {
      await ctx.useAdapter(config.adapter, result)
    }
    ctx.state.lastExport = filename
    ctx.emit('table-export:done', {
      filename,
      byteLength: result.byteLength,
      format
    })
    return result
  },
  teardown() {}
})

/**
 * Wrap an Adapter call with cooperative retry via `ctx.utils.retry`.
 * Default adapter name: `request`.
 */
export const requestWrapperSkill = defineSkill<
  RequestWrapperConfig,
  RequestWrapperResult
>({
  name: 'request-wrapper',
  async setup(ctx, config) {
    const adapter = config.adapter ?? 'request'
    let attempts = 0
    const data = await ctx.utils.retry(
      async (_attempt, signal) => {
        attempts += 1
        if (signal.aborted) throw signal.reason ?? new Error('aborted')
        return ctx.useAdapter(adapter, config.input)
      },
      {
        maxAttempts: config.maxAttempts ?? 3,
        delayMs: config.delayMs ?? 50,
        backoff: config.backoff ?? 2
      }
    )
    ctx.state.lastAttempts = attempts
    ctx.emit('request-wrapper:done', { attempts })
    return { data, attempts }
  },
  teardown() {}
})

export const OFFICIAL_BUILTIN_SKILLS = [
  tableSearchSkill,
  dictMappingSkill,
  formSubmitSkill,
  tableExportSkill,
  requestWrapperSkill
] as const

export const OFFICIAL_BUILTIN_NAMES = OFFICIAL_BUILTIN_SKILLS.map((s) => s.name)
