import React from 'react'
import { Heading } from '@chakra-ui/react'

type Props = {
  value: number
}

export const Price: React.FC<Props> = (props) => {
  return (
    <Heading fontWeight="semibold" fontSize="2xl">
      {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)}
    </Heading>
  )
}
