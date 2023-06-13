import { Center, Grid, GridItem, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

type Product = {
  id: string
  title: string
  pictureUrl: string
  priceInCents: number
  amount: number
}

export const ShoppingCartItem: React.FC<Product> = (props) => {
  return (
    <Grid
      width="full"
      templateColumns="repeat(3, 1fr)"
      templateRows="1fr"
      columnGap={4}
      padding={4}
    >
      <GridItem>
        <Center>
          <Image
            src={props.pictureUrl}
            width={75}
            height={75}
            objectFit="cover"
            alt={props.title}
          />
        </Center>
      </GridItem>
      <GridItem>
        <Center>
          <Text as="small">
            {props.amount} x {props.title}
          </Text>
        </Center>
      </GridItem>
      <GridItem>
        <Text width="full" textAlign="right">
          {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.priceInCents / 100)}
        </Text>
      </GridItem>
    </Grid>
  )
}
