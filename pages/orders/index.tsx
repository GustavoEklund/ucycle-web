import React from 'react'
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import { OrderStatus, OrderStatusText } from '@/domain/entities/.'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'

type ShippingAddress = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber: string | undefined
  landmark: string | undefined
  type: string
  phoneContact:
    | {
    id: string
    value: string
  }
    | undefined
}

type Shipping = {
  id: string
  priceInCents: number
  estimatedDeliveryDate: string
  address: ShippingAddress
}

type OrderItem = {
  id: string
  title: string
  pictureUrl: string
  priceInCents: number
  amount: number
}

type Order = {
  code: string
  createdAt: string
  updatedAt: string
  status: OrderStatus
  totalInCents: number
  shipping: Shipping
  items: OrderItem[]
}

const MyOrdersPage: React.FC = () => {
  const session = useSession()
  const { data: orders} = useQuery<Order[]>({
    queryKey: ['my-orders', session.data?.accessToken],
    enabled: !!session.data?.accessToken,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/orders?pageNumber=1&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      })
      return data
    },
  })

  return (
    <Box paddingBottom={28}>
      <Head>
        <title>Meus Pedidos</title>
      </Head>
      <TopNavigationBar title="Meus Pedidos" />
      <VStack padding={4}>
        {orders?.map((order: Order) => (
          <Card key={order.code} width="full">
            <CardHeader>
              <HStack width="full" justify="space-between">
                <Text>
                  {Intl.DateTimeFormat('pt-BR', {
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(order.createdAt))}
                </Text>
                <Text as="strong" color="green.400">
                  {OrderStatusText[order.status]}
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack>
                {order.items.map((item: OrderItem) => (
                  <Grid
                    key={item.id}
                    width="full"
                    templateColumns="75px auto 100px"
                    templateRows="1fr"
                    columnGap={4}
                  >
                    <GridItem>
                      <Center>
                        <Image
                          src={item.pictureUrl}
                          width={75}
                          height={75}
                          objectFit="cover"
                          alt={item.title}
                        />
                      </Center>
                    </GridItem>
                    <GridItem height={75}>
                      <Center>
                        <Text
                          as="small"
                          textOverflow="ellipsis"
                          noOfLines={2}
                        >
                          {item.amount} x {item.title}
                        </Text>
                      </Center>
                    </GridItem>
                    <GridItem>
                      <Text align="right">
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format((item.priceInCents / 100) * item.amount)}
                      </Text>
                    </GridItem>
                  </Grid>
                ))}
                <HStack width="full" paddingTop={4} justify="space-between">
                  <Text>Frete</Text>
                  <Text align="right">
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format((order.shipping.priceInCents / 100))}
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
            <CardFooter>
              <HStack width="full" justify="space-between" gap={4}>
                <Text as="small" variant="secondary">
                  Previsto para entrega em{' '}
                  {Intl.DateTimeFormat('pt-BR', {
                    month: 'long',
                    day: 'numeric',
                  }).format(new Date(order.shipping.estimatedDeliveryDate))}{' '}
                  em {order.shipping.address.street}, {order.shipping.address.buildingNumber} - {order.shipping.address.city}, {order.shipping.address.state}
                </Text>
                <Text align="right">
                  Total
                  <br />
                  <Text as="strong">
                    {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format((order.totalInCents + order.shipping.priceInCents) / 100)}
                  </Text>
                </Text>
              </HStack>
            </CardFooter>
          </Card>
        ))}
      </VStack>
    </Box>
  )
}

export default MyOrdersPage
