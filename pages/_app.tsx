import React from 'react'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { theme } from '@/styles/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

import { NavigationBar } from '@/components/navigation-bar'

const App: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
      <NavigationBar />
    </ChakraProvider>
  </SessionProvider>
)

export default App
