export interface BrowserInfo {
  browser: string
  version: string
  os: string
  device: string
  mobile: boolean
}

export function detectBrowser(ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''): BrowserInfo {
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua)
  let browser = 'unknown'
  let version = ''

  const edge = ua.match(/Edg\/(\d+)/)
  const chrome = ua.match(/Chrome\/(\d+)/)
  const firefox = ua.match(/Firefox\/(\d+)/)
  const safari = ua.match(/Version\/(\d+).*Safari/)

  if (edge) {
    browser = 'Edge'
    version = edge[1]
  } else if (chrome && !/Edg/.test(ua)) {
    browser = 'Chrome'
    version = chrome[1]
  } else if (firefox) {
    browser = 'Firefox'
    version = firefox[1]
  } else if (safari && !/Chrome/.test(ua)) {
    browser = 'Safari'
    version = safari[1]
  }

  let os = 'unknown'
  if (/Windows NT 10/.test(ua)) os = 'Windows'
  else if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/iPhone|iPad/.test(ua)) os = 'iOS'
  else if (/Linux/.test(ua)) os = 'Linux'

  const device = mobile ? 'mobile' : 'desktop'
  return { browser, version, os, device, mobile }
}
