import React from 'react'
import { Avatar, Box, Text, useTheme, VStack } from '@chakra-ui/react'
import { BiCartAlt, BiCog, BiExit, BiHelpCircle, BiShoppingBag, BiStore } from 'react-icons/bi'

import { MenuItem } from '@/components/.'

const ProfilePage: React.FC = () => {
  const { colors } = useTheme()

  return (
    <VStack height="100vh" overflowY="auto">
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
        Olá, Usuário
      </Text>
      <VStack paddingTop={8} paddingBottom={16} width="full">
        <MenuItem href="/products" icon={<BiShoppingBag size={24} />}>Continuar comprando</MenuItem>
        <MenuItem href="/products" icon={<BiCartAlt size={24}  />}>Meus pedidos</MenuItem>
        <MenuItem href="/products" icon={<BiStore size={24}  />}>Minhas vendas</MenuItem>
        <MenuItem href="/settings" icon={<BiCog size={24}  />}>Configurações</MenuItem>
        <MenuItem href="/products" icon={<BiHelpCircle size={24}  />}>Ajuda</MenuItem>
        <MenuItem href="/products" icon={<BiExit size={24}  />}>Sair</MenuItem>
      </VStack>
    </VStack>
  )
}

export default ProfilePage
