import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { Box, Heading, HStack, IconButton } from '@chakra-ui/react'

type Props = {
  title?: string
}

export const TopNavigationBar: React.FC<Props> = (props) => {
  return (
    <Box
      as="nav"
      boxShadow="sm"
      width="full"
      padding={4}
      position="sticky"
    >
      <HStack spacing="10">
        <IconButton aria-label="go-back" onClick={() => window.history.back()}>
          <BiArrowBack />
        </IconButton>
        <Heading fontSize="xl">{props.title}</Heading>
      </HStack>
    </Box>
  )
}
