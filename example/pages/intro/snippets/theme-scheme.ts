import { ThemeService } from 'amg-webui/theme'



ThemeService.init({ overrides: { design: 'linear', scheme: 'light' } })

ThemeService.setScheme('dark')

ThemeService.toggleScheme()



const cfg = ThemeService.getConfig()

// cfg.supportsScheme — only light | dark, no system theme

