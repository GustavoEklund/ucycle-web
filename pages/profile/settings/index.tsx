import React from 'react'
import { Button, useColorMode, VStack } from '@chakra-ui/react'
import Head from 'next/head'
import { TopNavigationBar } from '@/components/index'
import { BiMap, BiMoon, BiSun } from 'react-icons/bi'
import { useRouter } from 'next/router'

type MenuItemProps = {
  onClick?: () => void
  rightIcon?: React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined
  children?: React.ReactNode
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  return (
    <Button
      width="full"
      variant="ghost"
      textAlign="left"
      fontWeight="normal"
      padding={8}
      borderRadius={0}
      rightIcon={props.rightIcon}
      justifyContent="space-between"
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  )
}

const SettingsPage: React.FC = () => {
  const router = useRouter()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <VStack>
      <Head>
        <title>Configurações</title>
      </Head>
      <TopNavigationBar title="Configurações"/>
      <MenuItem
        rightIcon={colorMode === 'dark' ? <BiMoon size={24} /> : <BiSun size={24} />}
        onClick={toggleColorMode}
      >
        {colorMode === 'dark' ? 'Tema escuro' : 'Tema claro'}
      </MenuItem>
      <MenuItem
        rightIcon={<BiMap size={24} />}
        onClick={() => router.push('/profile/settings/addresses')}
      >
        Endereços
      </MenuItem>
    </VStack>
  )
}

export default SettingsPage
