/**
 * In-house demo code highlighter — no Shiki / Prism / highlight.js.
 * Tuned for Vue SFC + HTML template fragments used in curated play demos.
 */

export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'tag'
  | 'attr'
  | 'punctuation'
  | 'number'
  | 'boolean'
  | 'directive'

export interface CodeToken {
  kind: TokenKind
  text: string
}

export interface CodeLine {
  tokens: CodeToken[]
}

const JS_KEYWORDS =
  /^(?:await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|static|super|switch|this|throw|true|try|typeof|undefined|var|void|while|with|yield|type|interface|as|satisfies|keyof|readonly|infer|extends|implements|private|protected|public|abstract|async|declare|module|namespace|package)\b/

const BOOL_LIT = /^(?:true|false|null|undefined)\b/

function pushPlain(tokens: CodeToken[], text: string) {
  if (!text) return
  const last = tokens[tokens.length - 1]
  if (last?.kind === 'plain') last.text += text
  else tokens.push({ kind: 'plain', text })
}

function pushTok(tokens: CodeToken[], kind: TokenKind, text: string) {
  if (!text) return
  tokens.push({ kind, text })
}

/** Tokenize attribute region inside a tag (from after tag name to `>` / `/>`). */
function tokenizeAttrs(src: string, tokens: CodeToken[]) {
  let i = 0
  while (i < src.length) {
    const ch = src[i]!

    if (/\s/.test(ch)) {
      let j = i + 1
      while (j < src.length && /\s/.test(src[j]!)) j++
      pushPlain(tokens, src.slice(i, j))
      i = j
      continue
    }

    if (ch === '/' || ch === '>') {
      pushTok(tokens, 'punctuation', ch)
      i++
      continue
    }

    if (ch === '=' || ch === '.' || ch === ':' || ch === '@') {
      // leading `@` / `:` may start a directive name
      if ((ch === ':' || ch === '@') && /[\w.-]/.test(src[i + 1] ?? '')) {
        let j = i + 1
        while (j < src.length && /[\w.:@-]/.test(src[j]!)) j++
        pushTok(tokens, 'directive', src.slice(i, j))
        i = j
        continue
      }
      pushTok(tokens, 'punctuation', ch)
      i++
      continue
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let j = i + 1
      while (j < src.length) {
        if (src[j] === '\\') {
          j += 2
          continue
        }
        if (src[j] === quote) {
          j++
          break
        }
        j++
      }
      pushTok(tokens, 'string', src.slice(i, j))
      i = j
      continue
    }

    // attribute / directive name
    if (/[\w@:]/.test(ch)) {
      let j = i + 1
      while (j < src.length && /[\w.:@-]/.test(src[j]!)) j++
      const name = src.slice(i, j)
      const kind: TokenKind =
        name.startsWith('v-') || name.startsWith(':') || name.startsWith('@') || name.startsWith('#')
          ? 'directive'
          : 'attr'
      pushTok(tokens, kind, name)
      i = j
      continue
    }

    pushTok(tokens, 'punctuation', ch)
    i++
  }
}

function tokenizeTag(tagSrc: string, tokens: CodeToken[]) {
  // tagSrc includes leading `<` and trailing `>` / `/>`
  pushTok(tokens, 'punctuation', '<')
  let i = 1

  if (tagSrc[i] === '/') {
    pushTok(tokens, 'punctuation', '/')
    i++
  }

  // tag name
  let j = i
  while (j < tagSrc.length && /[\w.-]/.test(tagSrc[j]!)) j++
  if (j > i) {
    pushTok(tokens, 'tag', tagSrc.slice(i, j))
    i = j
  }

  const rest = tagSrc.slice(i)
  // strip final `>` or `/>` handled inside tokenizeAttrs via remaining chars
  tokenizeAttrs(rest, tokens)
}

function tokenizeJsLike(line: string, tokens: CodeToken[]) {
  let i = 0
  while (i < line.length) {
    const slice = line.slice(i)

    if (slice.startsWith('//')) {
      pushTok(tokens, 'comment', line.slice(i))
      return
    }

    if (slice.startsWith('/*')) {
      const end = line.indexOf('*/', i + 2)
      const j = end === -1 ? line.length : end + 2
      pushTok(tokens, 'comment', line.slice(i, j))
      i = j
      continue
    }

    const ch = line[i]!
    if (ch === '"' || ch === "'" || ch === '`') {
      const quote = ch
      let j = i + 1
      while (j < line.length) {
        if (line[j] === '\\') {
          j += 2
          continue
        }
        if (line[j] === quote) {
          j++
          break
        }
        j++
      }
      pushTok(tokens, 'string', line.slice(i, j))
      i = j
      continue
    }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(line[i + 1] ?? ''))) {
      let j = i + 1
      while (j < line.length && /[0-9_.xXa-fA-F]/.test(line[j]!)) j++
      pushTok(tokens, 'number', line.slice(i, j))
      i = j
      continue
    }

    if (/[A-Za-z_$]/.test(ch)) {
      let j = i + 1
      while (j < line.length && /[\w$]/.test(line[j]!)) j++
      const word = line.slice(i, j)
      if (BOOL_LIT.test(word)) pushTok(tokens, 'boolean', word)
      else if (JS_KEYWORDS.test(word)) pushTok(tokens, 'keyword', word)
      else pushPlain(tokens, word)
      i = j
      continue
    }

    if (/[{}()[\].,;:?<>!=+\-*/%&|^~]/.test(ch)) {
      pushTok(tokens, 'punctuation', ch)
      i++
      continue
    }

    pushPlain(tokens, ch)
    i++
  }
}

function tokenizeMarkupLine(line: string, tokens: CodeToken[]) {
  let i = 0
  while (i < line.length) {
    // HTML comment
    if (line.startsWith('<!--', i)) {
      const end = line.indexOf('-->', i + 4)
      const j = end === -1 ? line.length : end + 3
      pushTok(tokens, 'comment', line.slice(i, j))
      i = j
      continue
    }

    // Mustache
    if (line.startsWith('{{', i)) {
      const end = line.indexOf('}}', i + 2)
      const j = end === -1 ? line.length : end + 2
      pushTok(tokens, 'punctuation', '{{')
      const inner = line.slice(i + 2, end === -1 ? line.length : end)
      tokenizeJsLike(inner, tokens)
      if (end !== -1) pushTok(tokens, 'punctuation', '}}')
      i = j
      continue
    }

    if (line[i] === '<') {
      // find end of tag (naive but fine for demos)
      let j = i + 1
      let quote: string | null = null
      while (j < line.length) {
        const c = line[j]!
        if (quote) {
          if (c === '\\' && quote !== '`') {
            j += 2
            continue
          }
          if (c === quote) quote = null
          j++
          continue
        }
        if (c === '"' || c === "'" || c === '`') {
          quote = c
          j++
          continue
        }
        if (c === '>') {
          j++
          break
        }
        j++
      }
      tokenizeTag(line.slice(i, j), tokens)
      i = j
      continue
    }

    // plain text run until `<` or `{{`
    let j = i + 1
    while (j < line.length && line[j] !== '<' && !(line[j] === '{' && line[j + 1] === '{')) j++
    const chunk = line.slice(i, j)
    // may contain script-ish content in SFC script blocks — try light JS tokenize for import lines
    if (/^\s*(import|export|const|let|var|function|type|interface)\b/.test(chunk)) {
      tokenizeJsLike(chunk, tokens)
    } else {
      pushPlain(tokens, chunk)
    }
    i = j
  }
}

/**
 * Highlight a source string into line tokens.
 * `lang` is a hint (`vue` | `html` | `ts` | …); vue/html use markup lexer.
 */
export function highlightToLines(code: string, lang = 'vue'): CodeLine[] {
  const normalized = lang.trim().toLowerCase()
  const markup = normalized === 'vue' || normalized === 'html' || normalized === 'svg'
  const lines = code.replace(/\r\n/g, '\n').split('\n')

  return lines.map((line) => {
    const tokens: CodeToken[] = []
    if (line.length === 0) {
      tokens.push({ kind: 'plain', text: '\u00a0' })
    } else if (markup) {
      tokenizeMarkupLine(line, tokens)
    } else {
      tokenizeJsLike(line, tokens)
    }
    return { tokens }
  })
}
