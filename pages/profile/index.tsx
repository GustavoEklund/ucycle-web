import React from 'react'
import { Avatar, Box, Text, useTheme, VStack } from '@chakra-ui/react'
import { BiCartAlt, BiCog, BiDoorOpen, BiExit, BiHelpCircle, BiShoppingBag, BiStore } from 'react-icons/bi'
import { signIn, signOut, useSession } from 'next-auth/react'
import { MenuItem } from '@/components/index'
import { ShoppingCartContext } from '@/contexts/index'
import Head from 'next/head'

const ProfilePage: React.FC = () => {
  const { colors } = useTheme()
  const { data: session } = useSession()
  const { shoppingCart } = React.useContext(ShoppingCartContext)

  return (
    <VStack minHeight="100vh" overflowY="auto">
      <Head>
        <title>Perfil</title>
      </Head>
      <Box
        height={150}
        width="full"
        backgroundColor={colors.blue['500']}
        position="relative"
      >
        <Avatar
          position="absolute"
          top="100%"
          left={8}
          size="xl"
          transform="translateY(-50%)"
        />
      </Box>
      <Text
        textAlign="left"
        width="full"
        paddingLeft={7}
        paddingTop={16}
        fontWeight="bold"
      >
        Olá, { session?.user?.name ?? 'Visitante' }
      </Text>
      <VStack paddingTop={8} paddingBottom={16} width="full">
        { session ? null : <MenuItem href="#" onClick={() => signIn('keycloak')} icon={<BiDoorOpen size={24} />}>Entrar</MenuItem> }
        { session ? null : <MenuItem href="/account/sign-up" icon={<BiExit size={24} />}>Criar uma conta</MenuItem> }
        <MenuItem
          href={`/shopping-cart/${shoppingCart?.id || 'creating'}`}
          icon={(
            <Box position="relative">
              <BiShoppingBag size={24} />
              {(shoppingCart?.products.length  || 0) > 0 && (
                <Box
                  position="absolute"
                  top={-2}
                  right={-2}
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
                  {shoppingCart?.products.length}
                </Box>
              )}
            </Box>
          )}
        >
          Continuar comprando
        </MenuItem>
        <MenuItem href="/orders" icon={<BiCartAlt size={24} />}>Meus pedidos</MenuItem>
        <MenuItem href="/sales" icon={<BiStore size={24} />}>Minhas vendas</MenuItem>
        <MenuItem href="/profile/settings" icon={<BiCog size={24} />}>Configurações</MenuItem>
        <MenuItem href="/products" icon={<BiHelpCircle size={24}  />}>Ajuda</MenuItem>
        { session ? <MenuItem href="#" onClick={() => signOut()} icon={<BiExit size={24} />}>Sair</MenuItem> : null }
      </VStack>
    </VStack>
  )
}

export default ProfilePage
