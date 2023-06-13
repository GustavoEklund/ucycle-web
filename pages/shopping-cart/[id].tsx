import React from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Center, HStack, Text, VStack } from '@chakra-ui/react'
import { ShoppingCartContext } from '@/contexts/shopping-cart-context'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import { ShoppingCartItem } from '@/components/shopping-cart-item'
import Head from 'next/head'

const ShoppingCartPage = () => {
  const router = useRouter()
  const { shoppingCart } = React.useContext(ShoppingCartContext)

  const shoppingCartTotal = React.useMemo(() => {
    if (!shoppingCart) return 0
    return shoppingCart.products.reduce((accumulator, product) => accumulator + ((product.priceInCents / 100) * product.amount), 0)
  }, [shoppingCart])

  return (
    <VStack style={{ minHeight: '100vh' }}>
      <Head>
        <title>Carrinho de Compras</title>
      </Head>
      <TopNavigationBar title="Carrinho"/>
      {!shoppingCart || shoppingCart.products.length === 0 ? (
        <Center height="full">
          <Text>Nenhum produto no carrinho</Text>
        </Center>
      ) : (
        <VStack width="full">
          {shoppingCart.products.map((product) => (
            <ShoppingCartItem
              key={product.id}
              id={product.id}
              title={product.title}
              priceInCents={product.priceInCents}
              amount={product.amount}
              pictureUrl={product.pictureUrl}
            />
          ))}
          <HStack width="full" justifyContent="space-between" padding={8}>
            <Text marginLeft={4}>Total</Text>
            <Text>
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shoppingCartTotal)}
            </Text>
          </HStack>
          <Box width="full" padding={8}>
            <Button
              width="full"
              marginBottom={24}
              onClick={() => router.push('/order/checkout')}
            >
              Finalizar compra
            </Button>
          </Box>
        </VStack>
      )}
    </VStack>
  )
}

export default ShoppingCartPage
