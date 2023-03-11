import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { BiSearchAlt } from 'react-icons/bi'
import { Center, Grid, GridItem, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'

const Home: NextPage = () => {
  const { push } = useRouter()

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
          <InputLeftElement
            pointerEvents="none"
          >
            <BiSearchAlt />
          </InputLeftElement>
          <Input placeholder="Busque no uCycle" />
        </InputGroup>
      </Center>
      <Grid
        autoRows="10px"
        templateColumns="repeat(auto-fill, 45%)"
        justifyContent="center"
        color="white"
        textAlign="center"
      >
        <GridItem
          backgroundColor="red"
          rowEnd="span 26"
          margin={2}
          onClick={() => push('/product/any-product-id')}
          children={"1"}
        />
        <GridItem backgroundColor="blue" rowEnd="span 33" margin={2} children={"2"} />
        <GridItem backgroundColor="green" rowEnd="span 45" margin={2} children={"3"} />
        <GridItem backgroundColor="green" rowEnd="span 45" margin={2} children={"4"} />
        <GridItem backgroundColor="red" rowEnd="span 26" margin={2} children={"5"} />
        <GridItem backgroundColor="blue" rowEnd="span 33" margin={2} children={"6"} />
        <GridItem backgroundColor="red" rowEnd="span 26" margin={2} children={"7"} />
        <GridItem backgroundColor="blue" rowEnd="span 33" margin={2} children={"8"} />
        <GridItem backgroundColor="green" rowEnd="span 45" margin={2} children={"9"} />
      </Grid>
    </div>
  )
}

export default Home
