import { theme as chakraTheme, extendTheme, ThemeConfig  } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  } as ThemeConfig,
  colors: {
    ...chakraTheme.colors,
    primary: {
      main: '#1d1f21',
      light: '#2f3136',
      dark: '#0d0e0f',
    },
    secondary: {
      main: '#ada381',
      light: '#ffed00',
      dark: '#ff9000'
    },
  },
  fonts: {
    body: 'SF-Pro-Text, system-ui, sans-serif',
    heading: 'SF-Pro-Display, system-ui, sans-serif',
    ui: 'SF-Ui-Display, system-ui, sans-serif',
    mono: 'DM Sans, system-ui, monospace',
  },
  components: {
    Text: {
      variants: {
        secondary: (props) => ({
          color: mode('rgb(113, 128, 150)', 'rgba(255, 255, 255, 0.48)')(props)
        })
      }
    }
  }
})
