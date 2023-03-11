import React from 'react'
import { Box, Heading, HStack, IconButton } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import { useRouter } from 'next/router'

type Props = {
  children: React.ReactNode
}

export const Header: React.FC<Props> = (props) => {
  const { back } = useRouter()

  return (
    <HStack
      justifyContent="flex-start"
      alignItems="center"
      width="full"
      paddingY={2}
      paddingX={4}
    >
      <IconButton
        aria-label="back"
        variant="ghost"
        icon={<BiArrowBack size={24} />}
        onClick={back}
      />
      <Box>
        <Heading as="h1" fontSize="lg">{props.children}</Heading>
      </Box>
    </HStack>
  )
}
