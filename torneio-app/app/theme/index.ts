import { createConfig } from '@gluestack-ui/themed'
import { config as defaultConfig } from '@gluestack-ui/config'

export const config = createConfig({
  ...defaultConfig,
  tokens: {
    ...defaultConfig.tokens,
    colors: {
      ...defaultConfig.tokens.colors,
      primary: '#37A51E',
      background: '#FFFFFF',
      dark: '#0A5A3A',
    },
  },
})
