import React from 'react'
import { AlertIcon } from '@chakra-ui/alert'
import { Alert, AlertDescription, AlertTitle } from '@chakra-ui/react'

const OrderPlacedPage: React.FC = () => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="100vh"
    >
      <AlertIcon boxSize="40px" mr={0} />
      <AlertTitle mt={4} mb={1} fontSize="lg">
        Parabéns!
      </AlertTitle>
      <AlertDescription maxWidth="sm">
        Sua compra foi realizada com sucesso.
      </AlertDescription>
    </Alert>
  )
}

export default OrderPlacedPage
