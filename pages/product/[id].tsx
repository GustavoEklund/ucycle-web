import React from 'react'
import { Avatar, Button, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ProductSlideshow } from '@/components/product-slideshow'
import { Price } from '@/components/price'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import * as process from 'process'
import { ShoppingCartContext } from '@/contexts/.'
import { TopNavigationBar } from '@/components/top-navigation-bar'

type Product = {
  id: string
  title: string
  description: string
  pictureUrls: string[]
  price: {
    totalInCents: number
    discountInPercentage: number
    discount: number
  }
}

const ProductPage: React.FC = () => {
  const router = useRouter()
  const [product, setProduct] = React.useState<Product | undefined>(undefined)
  const [isLoading, setIsLoading] = React.useState(true)
  const { addProductToShoppingCart } = React.useContext(ShoppingCartContext)

  const loadProduct = React.useCallback(() => {
    setIsLoading(true)
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/products/${router.query.id}`)
      .then((response) => {
        if (response.status !== 200) return
        setProduct(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [router.query.id])

  const handleAddProductToShoppingCart = () => {
    if (product === undefined) return
    addProductToShoppingCart(product.id)
  }

  React.useEffect(() => {
    if (!router.isReady) return
    loadProduct()
  }, [router.isReady, loadProduct])

  return (
    <VStack paddingBottom={16}>
      <Head>
        <title>{product?.title || `Produto ${router.query.id}`}</title>
      </Head>
      <TopNavigationBar title={product?.title}/>
      {router.isReady && !isLoading && (
        <ProductSlideshow images={product?.pictureUrls.map((url) => ({ url })) || []} />
      )}
      <Container>
        <HStack justifyContent="flex-start" width="full">
          <Avatar />
          <Text fontWeight="medium" paddingX={3}>Usuário</Text>
        </HStack>
        <VStack width="full" alignItems="flex-start" marginY={6}>
          <Price value={(product?.price.totalInCents || 0) / 100} />
          <HStack gap={2}>
            <Image src="/images/visa-icon.png" width="30px" height="10px" layout="fixed" objectFit="contain" alt="Visa Icon" />
            <Image src="/images/master-card-icon.png" width="25px" height="15px" layout="fixed" objectFit="contain" alt="Master Card Icon"  />
            <Image src="/images/elo-icon.png" width="35px" height="14px" layout="fixed" objectFit="contain" alt="Elo Icon"  />
            <Image src="/images/boleto-icon.png" width="28px" height="18px" layout="fixed" objectFit="contain" alt="Boleto Icon"  />
            <Image src="/images/pix-icon.png" width="42px" height="15px" layout="fixed" objectFit="contain" alt="Pix Icon"  />
          </HStack>
        </VStack>
        <VStack textAlign="left" width="full" paddingBottom={16}>
          <VStack width="full">
            <Heading width="full" as="h2" fontSize="xl">Descrição</Heading>
            <Text
              variant="secondary"
              whiteSpace="pre-wrap"
              width="full"
            >
              {product?.description || ''}
            </Text>
          </VStack>
        </VStack>
        <VStack>
          <Button
            width="full"
            variant="outline"
          >
            Comprar
          </Button>
          <Button
            width="full"
            onClick={handleAddProductToShoppingCart}
          >
            Adicionar ao carrinho
          </Button>
        </VStack>
      </Container>
    </VStack>
  )
}

export default ProductPage
