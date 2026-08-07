import common from './common'
import button from './button'
import page from './page'
import tip from './tip'
import error from './error'
import auth from './auth'
import biz from './biz'
import nav from './nav'
import component from './component'
import industry from './industry'
import exampleDocLibrary from './exampleDoc.library'
import type { LocaleMessages } from '../message-schema'

const pack = {
  ...common,
  ...button,
  ...page,
  ...tip,
  ...error,
  ...auth,
  ...biz,
  ...nav,
  ...component,
  ...industry,
  ...exampleDocLibrary
} as LocaleMessages

export default pack
