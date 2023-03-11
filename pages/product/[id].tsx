import React from 'react'
import { Avatar, Container, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ProductSlideshow } from '@/components/product-slideshow'
import { Price } from '@/components/price'
import Image from 'next/image'

const ProductPage: React.FC = () => {
  const router = useRouter()
  const [product] = React.useState({
    id: router.query.id,
    title: 'Camisa Florida Farm',
    price: 100,
  })

  return (
    <VStack paddingBottom={16}>
      <Heading
        as="h1"
        width="full"
        textAlign="left"
        padding={6}
        fontSize="xl"
      >
        {product.title}
      </Heading>
      <ProductSlideshow
        images={[
          { url: 'https://d15tp84buh2rvk.cloudfront.net/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/i/m/img_0011_1_10.jpg' },
          { url: 'https://d15tp84buh2rvk.cloudfront.net/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/l/o/look_32_281.jpg' },
          { url: 'https://d15tp84buh2rvk.cloudfront.net/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/0/4/048a0035_3.jpg' },
          { url: 'https://d15tp84buh2rvk.cloudfront.net/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/0/4/048a0037_5.jpg' },
          { url: 'https://d15tp84buh2rvk.cloudfront.net/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/d/e/det_253.jpg' },
        ]}
      />
      <Container>
        <HStack justifyContent="flex-start" width="full">
          <Avatar />
          <Text fontWeight="medium" paddingX={3}>Mernie</Text>
        </HStack>
        <VStack width="full" alignItems="flex-start" marginY={6}>
          <Price value={product.price} />
          <HStack gap={2}>
            <Image src="/images/visa-icon.png" width="30px" height="10px" layout="fixed" objectFit="contain" alt="Visa Icon" />
            <Image src="/images/master-card-icon.png" width="25px" height="15px" layout="fixed" objectFit="contain" alt="Master Card Icon"  />
            <Image src="/images/elo-icon.png" width="35px" height="14px" layout="fixed" objectFit="contain" alt="Elo Icon"  />
            <Image src="/images/boleto-icon.png" width="28px" height="18px" layout="fixed" objectFit="contain" alt="Boleto Icon"  />
            <Image src="/images/pix-icon.png" width="42px" height="15px" layout="fixed" objectFit="contain" alt="Pix Icon"  />
          </HStack>
        </VStack>
        <VStack textAlign="left" width="full">
          <VStack width="full">
            <Heading width="full" as="h2" fontSize="xl">Descrição</Heading>
            <Text variant="secondary" whiteSpace="pre-wrap">
              {`* nome: camisa manga alegria solar farm
* composição: 100% algodão.
* Camisa farm modelo camisas, estampado , cor branca, manga longa. *as peças podem variar a estampa de acordo com o corte.
* a tonalidade das cores pode variar de acordo com a sua tela/monitor.

MEDIDAS MODELO:
* Karin - Altura 1,73m, Busto 86cm, Cintura 67cm, Quadril 96cm - Tamanho 38/ P.`}
            </Text>
          </VStack>
        </VStack>
      </Container>
    </VStack>
  )
}

export default ProductPage
