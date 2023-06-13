import React from 'react'
import { Box, Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useSession } from 'next-auth/react'

type SignUpFormData = {
  name: string
  email: string
  password: string
}

const SignUpPage: React.FC = () => {
  const router = useRouter()
  const session = useSession()
  const {
    handleSubmit,
    register,
    getValues,
    formState,
    setError,
  } = useForm<SignUpFormData>()

  const mutation = useMutation({
    mutationFn: async (data) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/signup`, {
        name: getValues('name'),
        email: getValues('email'),
        password: getValues('password'),
      })
      .then((response) => {
        if (response.status !== 204) return console.log(response.data)
        router.push('/account/sign-up/email-confirmation-sent')
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          const responseBody = error.response?.data
          responseBody?.errors?.forEach((error: { code: string; message: string }) => {
            if (error?.code === 'CONTACT_ALREADY_EXISTS_ERROR') {
              setError('email', {
                type: 'validate',
                message: 'O e-mail já está em uso',
              })
            }
          })
        }
      })
    },
  })

  const handleSignUp = async (data: SignUpFormData) => {
    mutation.mutate()
  }

  React.useEffect(() => {
    if (session.status === 'authenticated') router.push('/').then()
  }, [router, session.status])

  return (
    <Box width="full">
      <TopNavigationBar title="Cadastrar-se" />
      <VStack
        as="form"
        onSubmit={handleSubmit(handleSignUp)}
        width="full"
        padding={4}
        gap={4}
      >
        <FormControl isInvalid={!!formState.errors.name}>
          <FormLabel>Nome Completo</FormLabel>
          <Input
            type="text"
            autoComplete="name"
            {...register('name', {
              required: 'O nome é obrigatório',
              pattern: {
                value: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                message: 'O nome deve conter apenas letras',
              },
            })}
          />
          <FormErrorMessage>
            {formState.errors.name?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.email}>
          <FormLabel>E-mail</FormLabel>
          <Input
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'O e-mail é obrigatório',
              pattern: {
                value: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i,
                message: 'O e-mail deve ser válido',
              },
            })}
          />
          <FormErrorMessage>
            {formState.errors.email?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!formState.errors.password}>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            autoComplete="password"
            {...register('password', {
              required: 'A senha é obrigatória',
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
                message: 'A senha deve ter no mínimo 8 caracteres, pelo menos: uma letra minúscula, uma letra maiúscula, um número e um caractere especial.',
              },
            })}
          />
          <FormErrorMessage>
            {formState.errors.password?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl>
          <Checkbox required>Aceito receber novidades do <strong>uCycle</strong>.</Checkbox>
        </FormControl>
        <FormControl>
          <Checkbox required>Estou de acordo com os termos de serviço do <strong>uCycle</strong>.</Checkbox>
        </FormControl>
        <Button
          colorScheme="blue"
          width="full"
          isLoading={mutation.isLoading}
          type="submit"
          loadingText="Criando Conta..."
        >
          Criar Conta
        </Button>
      </VStack>
    </Box>
  )
}

export default SignUpPage
