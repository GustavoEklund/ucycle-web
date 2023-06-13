import React from 'react'
import { Avatar, Box, HStack, IconButton, Link, useTheme } from '@chakra-ui/react'
import { BiHome, BiMessageDetail, BiShoppingBag } from 'react-icons/bi'
import { AiOutlineTags } from 'react-icons/ai'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { ShoppingCartContext } from '@/contexts/.'

const ShoppingCartIconCount: React.FC<{ count?: number }> = ({ count }) => {
  if (count === undefined) return (<></>)
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width={4}
      height={4}
      borderRadius="full"
      backgroundColor="red.500"
      color="white"
      fontSize="xs"
      fontWeight="bold"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {count}
    </Box>
  )
}

export const BottomNavigationBar: React.FC = () => {
  const theme = useTheme()
  const router = useRouter()
  const { shoppingCart } = React.useContext(ShoppingCartContext)

  const homeIconVariant = React.useMemo(() => {
    return router.asPath === '/' ? 'solid' : 'ghost'
  }, [router.asPath])

  const shoppingCartIconVariant = React.useMemo(() => {
    return router.asPath.startsWith('/shopping-cart') ? 'solid' : 'ghost'
  }, [router.asPath])

  const profileIconVariant = React.useMemo(() => {
    return router.asPath.startsWith('/profile') ? 'solid' : 'ghost'
  }, [router.asPath])

  return (
    <HStack
      as="nav"
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      width="full"
      justifyContent="space-around"
      paddingY={2}
      paddingX={4}
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor={theme.colors.borderColor}
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
    >
      <NextLink href="/" passHref>
        <Link>
          <IconButton
            aria-label="home"
            icon={<BiHome size={24} />}
            variant={homeIconVariant}
          />
        </Link>
      </NextLink>
      <NextLink href={`/shopping-cart/${shoppingCart?.id}`} passHref>
        <Link position="relative">
          <IconButton
            aria-label="home"
            icon={<BiShoppingBag size={24} />}
            variant={shoppingCartIconVariant}
          />
          <ShoppingCartIconCount count={shoppingCart?.products.length} />
        </Link>
      </NextLink>
      <NextLink href="/product/add" passHref>
        <Link>
          <IconButton
            aria-label="add-product"
            icon={<AiOutlineTags size={24} />}
            variant="ghost"
          />
        </Link>
      </NextLink>
      <IconButton
        aria-label="home"
        icon={<BiMessageDetail size={24} />}
        variant="ghost"
      />
      <NextLink href="/profile" passHref>
        <Link>
          <IconButton
            aria-label="profile"
            icon={<Avatar size="sm" />}
            variant={profileIconVariant}
          />
        </Link>
      </NextLink>
    </HStack>
  )
}
