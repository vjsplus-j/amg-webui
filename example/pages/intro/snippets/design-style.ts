import { ThemeService } from 'amg-webui/theme'

ThemeService.init()
ThemeService.setStyle('linear')
ThemeService.subscribe((style) => {
  console.log('design style:', style)
})
