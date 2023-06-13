import React from 'react'
import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const EmailConfirmationSentPage: React.FC = () => {
  const session = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (session.status === 'authenticated') router.push('/').then()
  }, [router, session.status])

  return (
      <VStack padding={4} textAlign="center" height="100vh" justify="center" alignItems="center">
        <Heading>Enviamos um e-mail de confirmação para você</Heading>
        <br />
        <Text width="80%">Você precisa confirmar seu e-mail antes de continuar.</Text>
        <Text width="80%">Verifique sua caixa de entrada e clique no link de confirmação.</Text>
        <br />
        <Button width="full" onClick={() => signIn('keycloak')}>Eu já confirmei meu e-mail</Button>
      </VStack>
  )
}

export default EmailConfirmationSentPage
