import React from 'react'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'

import '@/styles/globals.css'
import { theme } from '@/styles/theme'
import { NavigationBar } from '@/components/navigation-bar'

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider resetCSS theme={theme}>
    <Component {...pageProps} />
    <NavigationBar />
  </ChakraProvider>
)

export default App
