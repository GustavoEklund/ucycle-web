import React from 'react'
import { Button, useColorMode, VStack } from '@chakra-ui/react'
import { Header } from '@/components/.'
import { BiMoon, BiSun } from 'react-icons/bi'

const SettingsPage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <VStack>
      <Header>Configurações</Header>
      <Button
        width="full"
        variant="ghost"
        textAlign="left"
        fontWeight="normal"
        padding={8}
        borderRadius={0}
        rightIcon={colorMode === 'dark' ? <BiMoon size={24} /> : <BiSun size={24} />}
        justifyContent="space-between"
        onClick={toggleColorMode}
      >
        {colorMode === 'dark' ? 'Tema escuro' : 'Tema claro'}
      </Button>
    </VStack>
  )
}

export default SettingsPage
