import React from 'react'
import { Button, Link } from '@chakra-ui/react'
import NextLink from 'next/link'

type Props = {
  children: React.ReactNode
  icon: React.ReactElement<any, string | React.JSXElementConstructor<any>>
  href: string
  onClick?: () => void
}

export const MenuItem: React.FC<Props> = (props) => {
  return (
    <NextLink
      href={props.href}
      style={{ width: '100%' }}
      passHref
    >
      <Link width="full">
        <Button
          width="full"
          variant="ghost"
          textAlign="left"
          fontWeight="normal"
          padding={8}
          borderRadius={0}
          rightIcon={props.icon}
          justifyContent="space-between"
          onClick={props.onClick}
        >
          {props.children}
        </Button>
      </Link>
    </NextLink>
  )
}
