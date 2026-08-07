import { LocaleService } from 'amg-webui/locale'
import { useLocale } from 'amg-webui/hooks'

LocaleService.init()

const { setLocale } = useLocale()
setLocale('ar-SA')
