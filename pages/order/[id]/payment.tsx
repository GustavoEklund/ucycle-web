import React from 'react'
import Head from 'next/head'
import { Box, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { CardPayment, Payment, initMercadoPago } from '@mercadopago/sdk-react'
import { TopNavigationBar } from '@/components/top-navigation-bar'
import {
  IAdditionalData,
  ICardPaymentBrickPayer,
  ICardPaymentFormData,
} from '@mercadopago/sdk-react/bricks/cardPayment/type'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/router'
import { OrderStatus } from '@/domain/entities'

initMercadoPago('TEST-46b0ef54-9b90-4188-8427-91a64da24243')

type TPaymentBrickPaymentType = 'atm' | 'ticket' | 'bank_transfer' | 'creditCard' | 'debitCard' | 'wallet_purchase' | 'onboarding_credits'

interface ISavedCardPayer {
  type: string
  id: string
}

interface TicketFormData {
  transaction_amount: number
  payment_method_id: string
  payer: any
}

type PaymentData = {
  payment: {
    method: {
      id: string
    }
    installments: number
    token: string
  }
}

interface IPaymentFormData {
  paymentType: TPaymentBrickPaymentType;
  selectedPaymentMethod: TPaymentBrickPaymentType;
  formData: ICardPaymentFormData<ICardPaymentBrickPayer> & ICardPaymentFormData<ISavedCardPayer> & TicketFormData;
  additionalData?: IAdditionalData;
}

type Order = {
  code: string
  status: OrderStatus
  total: number
  freight: number
  estimatedDelivery: string
  createdAt: string
}

export const OrderPaymentPage: React.FC = () => {
  const session = useSession()
  const colorMode = useColorMode()
  const router = useRouter()
  const toast = useToast()

  const { data: order } = useQuery<Order>({
    queryKey: ['order', router.query.id, session.data?.accessToken],
    enabled: !!session.data?.accessToken,
    queryFn: async () => {
      return axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/${router.query.id}`, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      })
        .then((response) => {
          if (response.status !== 200) {
            toast({
              title: 'Erro',
              description: 'Erro ao carregar pedido',
              status: 'error',
              duration: 5000,
              isClosable: true,
            })
            return
          }
          return response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
  })

  const mutation = useMutation<any, any, PaymentData>({
    mutationFn: async (paymentData: PaymentData)=> {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/orders/${router.query.id}/pay`, paymentData, {
        headers: {
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
      })
      .then((response) => {
        if (response.status !== 201) {
          toast({
            title: 'Erro',
            description: 'Erro ao processar pagamento',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
        return router.push(`/order/${router.query.id}/placed`)
      })
      .catch((error) => {
        console.log(error)
        toast({
          title: 'Erro',
          description: 'Erro ao processar pagamento',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
    },
  })

  const handleSubmit = async (param: IPaymentFormData, param2?: IAdditionalData | undefined): Promise<void> => {
    console.log(param, param2)
    mutation.mutate({
      payment: {
        method: {
          id: param.formData.payment_method_id,
        },
        installments: param.formData.installments,
        token: param.formData.token,
      }
    })
  }

  return (
    <Box paddingBottom={24} width="full">
      <TopNavigationBar title="Pagamento do Pedido" />
      <Payment
        onSubmit={handleSubmit}
        initialization={{
          amount: order ? order.total / 100 : 0,
          payer: {
            email: session.data?.user?.email ?? '',
          },
        }}
        customization={{
          visual: {
            style: {
              theme: colorMode.colorMode === 'light' ? 'default' : 'dark',
            },
          },
          paymentMethods: {
            ticket: 'all',
            bankTransfer: 'all',
            creditCard: 'all',
            debitCard: 'all',
            mercadoPago: 'all',
          },
        }}
      />
    </Box>
  )
}

export default OrderPaymentPage
