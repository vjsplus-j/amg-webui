import 'amg-webui'
import {
  FontService,
  IconStyleService,
  ThemeService
} from '@amg-webui/theme'
import { LocaleService } from '@amg-webui/locale'

/** Initialize AMG theme + locale services for showcase apps. */
export function bootstrapAmgRuntime() {
  FontService.init()
  IconStyleService.init()
  ThemeService.init()
  LocaleService.init()
}
