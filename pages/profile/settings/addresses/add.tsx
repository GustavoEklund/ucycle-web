import React from 'react'
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import { TopNavigationBar } from '@/components/.'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

enum AddressType {
  apartment = 'APARTMENT',
  house = 'HOUSE',
  business = 'BUSINESS',
  other = 'OTHER',
}

type AddAddressForm = {
  zipCode: string
  state: string
  city: string
  neighbourhood: string
  street: string
  buildingNumber: string
  landmark: string
  type: AddressType
}

const AddAddressPage: React.FC = () => {
  const router = useRouter()
  const session = useSession()
  const {
    register,
    handleSubmit,
    formState,
    setValue,
    setFocus,
  } = useForm<AddAddressForm>()

  const handleAddAddress = async (data: AddAddressForm) => {
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/address`, {
      zipCode: data.zipCode,
      state: data.state,
      city: data.city,
      neighbourhood: data.neighbourhood,
      street: data.street,
      buildingNumber: data.buildingNumber,
      landmark: data.landmark,
      type: data.type,
      country: 'BR',
    }, {
      headers: {
        Authorization: `Bearer ${session.data?.accessToken}`,
      }
    })
      .then((response) => {
        if (response.status !== 204) return console.error(response.data)
        if (!router.query.callbackUrl) router.push('/profile/settings/addresses')
        router.push(router.query.callbackUrl as string)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleErrors = (errors: any) => {
    console.log(errors)
  }

  return (
    <VStack>
      <Head>
        <title>Adicionar Novo Endereço</title>
      </Head>
      <TopNavigationBar title="Adicione um endereço"/>
      <form onSubmit={handleSubmit(handleAddAddress, handleErrors)}>
        <VStack padding={4} gap={4} paddingBottom={24}>
          <FormControl isInvalid={!!formState.errors.zipCode}>
            <FormLabel htmlFor="zipCode">CEP</FormLabel>
            <Input
              type="text"
              id="zipCode"
              maxLength={9}
              autoComplete="off"
              placeholder="00000-000"
              required
              {...register('zipCode', {
                pattern: {
                  value: /^\d{5}-\d{3}$/,
                  message: 'CEP inválido',
                },
                onChange: async (event) => {
                  const zipCode = event.target.value
                  const onlyNumbersZipCode = zipCode.replace(/\D/g, '')
                  event.target.value = onlyNumbersZipCode.replace(/(\d{5})(\d{3})/, '$1-$2')
                  if (onlyNumbersZipCode.length < 8) return
                  const response = await axios.get(`https://brasilapi.com.br/api/cep/v2/${onlyNumbersZipCode}`)
                  if (response.status !== 200) return
                  const { state, city, neighborhood, street } = response.data
                  setValue('state', state)
                  setValue('city', city)
                  setValue('neighbourhood', neighborhood)
                  setValue('street', street)
                  setFocus('buildingNumber')
                }
              })}
            />
            <FormErrorMessage>
              {formState.errors.zipCode?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isDisabled isInvalid={!!formState.errors.state}>
            <FormLabel htmlFor="state">Estado</FormLabel>
            <Input
              type="text"
              id="state"
              placeholder="Estado"
              autoComplete="off"
              required
              {...register('state', {
                required: 'Estado é obrigatório',
              })}
            />
            <FormErrorMessage>
              {formState.errors.state?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isDisabled isInvalid={!!formState.errors.city}>
            <FormLabel htmlFor="city">Cidade</FormLabel>
            <Input
              type="text"
              id="city"
              placeholder="Cidade"
              autoComplete="off"
              required
              {...register('city', {
                required: 'Cidade é obrigatória',
              })}
            />
            <FormErrorMessage>
              {formState.errors.city?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formState.errors.neighbourhood}>
            <FormLabel htmlFor="neighbourhood">Bairro</FormLabel>
            <Input
              type="text"
              id="neighbourhood"
              placeholder="Bairro"
              autoComplete="off"
              {...register('neighbourhood', {
                required: 'Bairro é obrigatório',
              })}
            />
          </FormControl>
          <FormControl isInvalid={!!formState.errors.street}>
            <FormLabel htmlFor="street">Rua/Avenida</FormLabel>
            <Input
              type="text"
              id="street"
              placeholder="Rua"
              autoComplete="off"
              required
              {...register('street', {
                required: 'Rua/Avenida é obrigatória',
              })}
            />
            <FormErrorMessage>
              {formState.errors.street?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formState.errors.buildingNumber}>
            <FormLabel htmlFor="buildingNumber">Número (opcional)</FormLabel>
            <Input
              type="text"
              id="buildingNumber"
              placeholder="Número"
              autoComplete="off"
              {...register('buildingNumber')}
            />
          </FormControl>
          <FormControl isInvalid={!!formState.errors.type}>
            <FormLabel>Tipo de endereço</FormLabel>
            <Select
              id="addressType"
              placeholder="Selecione o tipo de endereço"
              autoComplete="off"
              required
              {...register('type', {
                required: 'Tipo de endereço é obrigatório',
              })}
            >
              <option value={AddressType.apartment}>Apartamento</option>
              <option value={AddressType.house}>Casa</option>
              <option value={AddressType.business}>Trabalho</option>
              <option value={AddressType.other}>Outro</option>
            </Select>
            <FormErrorMessage>
              {formState.errors.type?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formState.errors.landmark}>
            <FormLabel htmlFor="landmark">Complemento (opcional)</FormLabel>
            <Input
              type="text"
              id="landmark"
              placeholder="Complemento"
              autoComplete="off"
              {...register('landmark')}
            />
            <FormErrorMessage>
              {formState.errors.landmark?.message}
            </FormErrorMessage>
          </FormControl>
          <Box width="full">
            <Button type="submit" variant="solid" width="full">Salvar</Button>
          </Box>
        </VStack>
      </form>
    </VStack>
  )
}

export default AddAddressPage
