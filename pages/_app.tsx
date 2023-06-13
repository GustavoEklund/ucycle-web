import React from 'react'
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { theme } from '@/styles/theme'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { BottomNavigationBar } from '@/components/bottom-navigation-bar'
import { ShoppingCartProvider } from '@/contexts/.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'

const queryClient = new QueryClient()

const App: React.FC<AppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => (
  <SessionProvider session={session}>
    <QueryClientProvider client={queryClient}>
      <ShoppingCartProvider>
        <ChakraProvider resetCSS theme={theme}>
          <Head>
            <meta
              name='viewport'
              content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
            />

            <meta name="application-name" content="uCycle" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="uCycle" />
            <meta name="description" content="Aplicação voltada para o mercado da moda, este é um ambiente que possibilita a venda, troca, ou doação de materiais usados ou pré-existentes. Desde resíduos têxteis, roupas usadas, e materiais diversos que passam por um crivo de avaliação." />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="msapplication-config" content="/images/icons/browserconfig.xml" />
            <meta name="msapplication-TileColor" content="#7A81FF" />
            <meta name="msapplication-tap-highlight" content="no" />
            <meta name="theme-color" content="#7A81FF" />

            <link rel="apple-touch-icon" href="/images/icons/ios/touch-icon-iphone.png" />
            <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/ios/touch-icon-ipad.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/ios/touch-icon-iphone-retina.png" />
            <link rel="apple-touch-icon" sizes="167x167" href="/images/icons/ios/touch-icon-ipad-retina.png" />

            <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
            <link rel="manifest" href="/manifest.json" />
            <link rel="mask-icon" href="/images/icons/ios/safari-pinned-tab.svg" color="#5bbad5" />
            <link rel="shortcut icon" href="/favicon.ico" />

            <meta name="twitter:card" content="summary" />
            <meta name="twitter:url" content="http://localhost:3001" />
            <meta name="twitter:title" content="uCycle" />
            <meta name="twitter:description" content="Aplicação voltada para o mercado da moda, este é um ambiente que possibilita a venda, troca, ou doação de materiais usados ou pré-existentes. Desde resíduos têxteis, roupas usadas, e materiais diversos que passam por um crivo de avaliação." />
            <meta name="twitter:image" content="http://localhost:3001/images/icons/android/android-chrome-192x192.png" />
            <meta name="twitter:creator" content="@uCycle" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="uCycle" />
            <meta property="og:description" content="Aplicação voltada para o mercado da moda, este é um ambiente que possibilita a venda, troca, ou doação de materiais usados ou pré-existentes. Desde resíduos têxteis, roupas usadas, e materiais diversos que passam por um crivo de avaliação." />
            <meta property="og:site_name" content="uCycle" />
            <meta property="og:url" content="http://localhost:3001" />
            <meta property="og:image" content="http://localhost:3001/images/icons/ios/apple-touch-icon.png" />

            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_2048.png' sizes='2048x2732' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_1668.png' sizes='1668x2224' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_1536.png' sizes='1536x2048' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_1125.png' sizes='1125x2436' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_1242.png' sizes='1242x2208' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_750.png' sizes='750x1334' />
            <link rel='apple-touch-startup-image' href='/images/icons/ios/apple_splash_640.png' sizes='640x1136' />
          </Head>
          <Component {...pageProps} />
          <BottomNavigationBar />
        </ChakraProvider>
      </ShoppingCartProvider>
    </QueryClientProvider>
  </SessionProvider>
)

export default App
