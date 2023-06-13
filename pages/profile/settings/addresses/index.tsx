import React from 'react'
import { Box, Text, Heading, HStack, VStack, Button, Card, CardBody } from '@chakra-ui/react'
import { BiHome } from 'react-icons/bi'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import Head from 'next/head'

type AddressItemProps = {
  name: string
  street: string
  zipCode: string
  city: string
  state: string
  phoneNumber: string
}

const AddressItem: React.FC<AddressItemProps> = (props) => {
  return (
    <Box width="full" paddingX={4}>
      <Card width="full">
        <CardBody>
          <HStack alignItems="flex-start" gap={2}>
            <BiHome size={24} />
            <VStack>
              <Heading as="h2" width="full" fontSize="1.2rem">{props.street}</Heading>
              <Text width="full">CEP: {props.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2')} - {props.state} - {props.city}</Text>
              <Text width="full">{props.name} {props.phoneNumber}</Text>
            </VStack>
          </HStack>
        </CardBody>
      </Card>
    </Box>
  )
}

enum AddressType {
  apartment = 'APARTMENT',
  house = 'HOUSE',
  business = 'BUSINESS',
  other = 'OTHER',
}

type Address = {
  id: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  neighbourhood: string
  buildingNumber: string | undefined
  landmark: string | undefined
  phoneContact:
    | {
        id: string
        value: string
      }
    | undefined
  type: AddressType
}

const AddressesPage: React.FC = () => {
  const session = useSession()
  const router = useRouter()
  const [addresses, setAddresses] = React.useState<Address[]>([])

  React.useEffect(() => {
    if (!session.data?.accessToken) return
    const controller = new AbortController()
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/addresses`, {
      headers: {
        Authorization: `Bearer ${session.data?.accessToken}`,
      },
      signal: controller.signal,
    })
      .then((response) => {
        if (response.status !== 200) return
        setAddresses(response.data)
      })
      .catch((error) => {
        if (axios.isCancel(error)) return
        console.log(error)
      })
    return () => {
      controller.abort()
    }
  }, [session.data?.accessToken])

  return (
    <VStack>
      <Head>
        <title>Meus Endereços</title>
      </Head>
      <TopNavigationBar title="Endereços"/>
      {addresses.map((address) => (
        <AddressItem
          key={address.id}
          name={session.data?.user?.name || ''}
          street={address.street}
          zipCode={address.zipCode}
          city={address.city}
          state={address.state}
          phoneNumber={address.phoneContact?.value || ''}
        />
      ))}
      <Box width="full" padding={4}>
        <Button
          width="full"
          variant="outline"
          onClick={() => router.push('/profile/settings/addresses/add')}
        >
          Adicionar endereço
        </Button>
      </Box>
    </VStack>
  )
}

export default AddressesPage
