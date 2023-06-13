import React from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { BiEdit } from 'react-icons/bi'
import { Box, Button, Center, Divider, Heading, HStack, IconButton, Text, VStack } from '@chakra-ui/react'
import { ShoppingCartContext } from '@/contexts/shopping-cart-context'
import { TopNavigationBar, ShoppingCartItem } from '@/components/.'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Head from 'next/head'

enum AddressType {
  apartment = 'APARTMENT',
  house = 'HOUSE',
  business = 'BUSINESS',
  other = 'OTHER',
}

type Address = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber: string | undefined
  landmark: string | undefined
  phoneContact:
    | {
    id: string
    value: string
  }
    | undefined
  type: AddressType
}

const CheckoutPage: React.FC = () => {
  const session = useSession()
  const router = useRouter()
  const { shoppingCart, createNewShoppingCart } = React.useContext(ShoppingCartContext)
  const [selectedAddress, setSelectedAddress] = React.useState<Address | undefined>(undefined)
  const queryClient = useQueryClient()

  const { data: addresses, isLoading: isLoadingAddresses } = useQuery<Address[]>({
    queryKey: ['addresses', session.data?.accessToken],
    enabled: !!session.data?.accessToken,
    queryFn: async () => {
      return axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      }).then((response) => response.data)
    },
  })

  const { data: freight, isLoading: isLoadingFreightPrice } = useQuery<unknown, unknown, { price: number, estimatedShipmentDate: Date }>({
    queryKey: ['freight', selectedAddress, shoppingCart],
    enabled: !!selectedAddress && !!shoppingCart,
    queryFn: async () => {
      if (selectedAddress === undefined) return;
      return axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/calculate-freight/${selectedAddress.zipCode}`)
        .then((response) => {
          if (response.status !== 200) throw new Error('error while calculating freight price')
          return Promise.resolve({
            price: response.data.valueInCents / 100,
            estimatedShipmentDate: new Date(response.data.estimatedDeliveryDate),
          })
        })
    }
  })

  const { mutate } = useMutation<any>({
    mutationFn: async () => {
      return await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/order/checkout`, {
        shipping: {
          address: {
            id: selectedAddress?.id,
          },
        },
        items: shoppingCart?.products.map((product) => ({
          id: product.id,
          amount: product.amount,
        })),
        coupons: [],
      }, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      }).then((response) => response.data) as Promise<{ order: { id: string }}>
    },
    onSuccess: async (data, variables) => {
      createNewShoppingCart()
      await queryClient.invalidateQueries(['shopping-cart', session.data?.accessToken])
      await queryClient.invalidateQueries(['my-orders', session.data?.accessToken])
      await router.push(`/order/${data.order.id}/payment`)
    },
    onError: (error) => {
      console.error(error)
    },
  })

  React.useEffect(() => {
    if (addresses === undefined) return
    if (addresses.length === 0) return
    setSelectedAddress(addresses[0])
  }, [addresses])

  const shoppingCartTotal = React.useMemo(() => {
    if (!shoppingCart) return 0
    return shoppingCart.products.reduce((accumulator, product) => accumulator + ((product.priceInCents / 100) * product.amount), 0)
  }, [shoppingCart])

  return (
    <Box>
      <Head>
        <title>Finalizar Pedido</title>
      </Head>
      <TopNavigationBar title="Finalizar compra" />
      <VStack textAlign="left">
        <Heading
          as="h2"
          fontSize="lg"
          marginTop={8}
          paddingX={8}
          width="full"
        >
          Confirmar endereço de entrega
        </Heading>
        <Box width="full">
          {isLoadingAddresses ? (<Center width="full">Carregando...</Center>) : (
            Number(addresses?.length) > 0 ? (
              <Box padding={8}>
                {selectedAddress && (
                  <HStack>
                    <Box width="70%">
                      <Text as="small">
                        {selectedAddress.street},
                        nº {selectedAddress.buildingNumber},
                        {selectedAddress.neighbourhood} -
                        {selectedAddress.city}/{selectedAddress.state} -
                        CEP: {selectedAddress.zipCode}
                      </Text>
                    </Box>
                    <Center width="30%">
                      <IconButton aria-label="Editar endereço" variant="ghost" icon={<BiEdit size={24} />} />
                    </Center>
                  </HStack>
                )}
              </Box>
            ) : (
              <VStack padding={8} textAlign="center">
                <Text>Você não possui nenhum endereço cadastrado.</Text>
                <br/>
                <Button onClick={() => router.push('/profile/settings/addresses/add')}>Adicionar endereço</Button>
              </VStack>
            )
          )}
        </Box>
        <Divider />
        <Box width="full">
          <Heading
            as="h2"
            fontSize="lg"
            marginTop={8}
            paddingX={8}
            width="full"
          >
            Frete
          </Heading>
          <HStack padding={8} gap={8}>
            <Text whiteSpace="nowrap">
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(freight?.price || 0)}
            </Text>
            <Text>Prazo estimado de entrega: {freight?.estimatedShipmentDate?.toLocaleDateString()}</Text>
          </HStack>
        </Box>
        <Divider />
        <Box width="full">
          <Heading
            as="h2"
            fontSize="lg"
            marginTop={8}
            paddingX={8}
            width="full"
          >
            Resumo da compra
          </Heading>
          {shoppingCart?.products.map((product) => (
            <ShoppingCartItem
              key={product.id}
              id={product.id}
              title={product.title}
              priceInCents={product.priceInCents}
              amount={product.amount}
              pictureUrl={product.pictureUrl}
            />
          ))}
          <HStack width="full" justifyContent="space-between" padding={4}>
            <Text marginLeft={4}>Total</Text>
            <Text>
              {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shoppingCartTotal + (freight?.price || 0))}
            </Text>
          </HStack>
          <Box width="full" padding={8}>
            <Button
              width="full"
              marginBottom={24}
              onClick={() => mutate()}
              // onClick={() => router.push('/order/placed')}
            >
              Finalizar compra
            </Button>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default CheckoutPage
