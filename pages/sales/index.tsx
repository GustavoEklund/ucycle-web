import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center, Divider,
  Grid,
  GridItem,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { OrderStatus, OrderStatusText } from '@/domain/entities'
import Image from 'next/image'
import React from 'react'

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

const MySalesPage = () => {
  const session = useSession()
  const { data: orders} = useQuery<Order[]>({
    queryKey: ['my-orders', session.data?.accessToken],
    enabled: !!session.data?.accessToken,
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/sales?pageNumber=1&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      })
      return data
    },
  })

  const getActionBasedOnStatus = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.DELIVERY_PENDING:
        return OrderStatusText[OrderStatus.DELIVERY_IN_PROGRESS]
      case OrderStatus.DELIVERY_IN_PROGRESS:
        return OrderStatusText[OrderStatus.DELIVERY_IN_ROUTE]
      case OrderStatus.DELIVERY_IN_ROUTE:
        return OrderStatusText[OrderStatus.DELIVERED]
      case OrderStatus.DELIVERED:
        return OrderStatusText[OrderStatus.DELIVERY_ERROR]
      default:
        return 'Aguardando Pagamento'
    }
  }

  const isActionDisabled = (status: OrderStatus): boolean => {
    return [
      OrderStatus.DRAFT,
      OrderStatus.PENDING_APPROVAL,
      OrderStatus.APPROVED,
      OrderStatus.DISAPPROVED,
      OrderStatus.CANCELED,
      OrderStatus.PAYMENT_PENDING,
      OrderStatus.PAYMENT_ERROR,
    ].includes(status)
  }

  return (
    <Box paddingBottom={28}>
      <TopNavigationBar title="Minhas Vendas" />
      <VStack padding={4}>
        {orders?.map((order: Order) => (
          <Card key={order.code} width="full">
            <CardHeader display="flex" flexDirection="column">
              <HStack
                width="full"
                justify="space-between"
                gap={4}
              >
                <GridItem>
                  <Center height="full">
                    <Text align="left" width="full">
                      {Intl.DateTimeFormat('pt-BR', {
                        month: 'long',
                        day: 'numeric',
                      }).format(new Date(order.createdAt))}
                    </Text>
                  </Center>
                </GridItem>
                <GridItem>
                  <Center height="full">
                    <Text as="strong" color="green.400">
                      {OrderStatusText[order.status]}
                    </Text>
                  </Center>
                </GridItem>
              </HStack>
              <Divider marginY={4}/>
              <Button
                width="full"
                whiteSpace="break-spaces"
                isDisabled={isActionDisabled(order.status)}
              >
                {isActionDisabled(order.status) ? 'Aguardando Pagamento' : (
                  <>Atualizar para: {getActionBasedOnStatus(order.status)}</>
                )}
              </Button>
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

export default MySalesPage
