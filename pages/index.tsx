import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BiSearchAlt } from 'react-icons/bi'
import {
  Center,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
  useTheme,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import axios from 'axios'
import * as process from 'process'

type Product = {
  id: string
  title: string
  pictureUrl: string
  price: {
    totalInCents: number
    discountInPercentage: number
  }
}

const Home: NextPage = () => {
  const { push } = useRouter()
  const theme = useTheme()
  const overlayColor = useColorModeValue('blackAlpha.900', 'blackAlpha.900')
  const [products, setProducts] = React.useState<Product[]>([])
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)
  const [searchTerms, setSearchTerms] = React.useState('')
  const [searchRequested, setSearchRequested] = React.useState(false)

  const handleLoadProducts = React.useCallback(() => {
    if (!hasMore || isLoading) return
    setIsLoading(true)
    const query = new URLSearchParams({
      pageNumber: page.toString(),
      pageSize: '10',
    })
    if (searchTerms.trim().length > 0) query.set('searchTerms', searchTerms)
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/products?${query.toString()}`)
      .then((response) => {
        if (response.status !== 200) return
        const newProducts = response.data
        if (newProducts.length === 0) return setHasMore(false)
        setProducts([...products, ...newProducts])
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [hasMore, isLoading, page, products, searchTerms])

  const handleChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(event.target.value.trim())
  }

  const handleSubmitSearchInput = () => {
    setProducts([])
    setPage(0)
    setPage(1)
    setHasMore(true)
    setSearchRequested(true)
  }

  const handleImageLoad = (imageSizes: { naturalWidth: number, naturalHeight: number }, productId: string) => {
    const gridItem = document.getElementById(productId)
    if (gridItem) {
      const imageHeight = imageSizes.naturalHeight
      const gridRowEnd = Math.ceil(imageHeight / 10)
      const defaultGridRowEndBetween26And36 = Math.floor(Math.random() * (36 - 26 + 1)) + 26
      gridItem.style.setProperty('grid-row-end', `span ${Math.min(gridRowEnd, defaultGridRowEndBetween26And36)}`)
    }
  }

  const handleScroll = () => {
    const windowHeight = window.innerHeight
    const scrollY = window.scrollY || window.pageYOffset
    const documentHeight = document.documentElement.scrollHeight
    const isAtBottom = windowHeight + scrollY >= documentHeight
    if (isAtBottom) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  React.useEffect(() => {
    handleLoadProducts()
    setSearchRequested(false)
  }, [page, searchRequested])

  return (
    <div>
      <Head>
        <title>uCycle</title>
      </Head>
      <Center paddingY={10}>
        <Image src="/images/ucycle-icon.png" width="50px" height="40px" alt="uCycle Icon" />
      </Center>
      <Center>
        <InputGroup marginX={7} marginBottom={16} >
          <InputLeftElement pointerEvents="none">
            <BiSearchAlt />
          </InputLeftElement>
          <Input
            placeholder="Busque no uCycle"
            onChange={handleChangeSearchInput}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                handleSubmitSearchInput()
                if (event.target instanceof HTMLInputElement) event.target.blur()
              }
            }}
          />
        </InputGroup>
      </Center>
      <Grid
        autoRows="10px"
        templateColumns="repeat(auto-fill, 45%)"
        justifyContent="center"
        paddingBottom={24}
      >
        {products.map((product) => (
          <GridItem
            key={product.id}
            id={product.id}
            style={{ gridRowEnd: 'span 26' }}
            margin={1}
            onClick={() => push(`/product/${product.id}`)}
            position="relative"
            overflow="hidden"
          >
            <Image
              src={product.pictureUrl}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              onLoadingComplete={(imageSizes) => handleImageLoad(imageSizes, product.id)}
            />
            <VStack
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height={32}
              padding={2}
              backgroundImage={`linear-gradient(to top, ${overlayColor}, ${theme.colors.transparent})`}
              justifyContent="flex-end"
              alignItems="flex-start"
            >
              <Text
                noOfLines={2}
                textOverflow="ellipsis"
                fontWeight="bold"
                color="white"
              >
                {product.title}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="green.400"
                marginTop="0 !important"
              >
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price.totalInCents / 100)}
              </Text>
            </VStack>
          </GridItem>
        ))}
      </Grid>
    </div>
  )
}

export default Home
