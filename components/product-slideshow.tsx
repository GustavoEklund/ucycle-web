import React from 'react'
import Image from 'next/image'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

export type Props = {
  images: {
    url: string
    caption?: string
  }[]
}

export const ProductSlideshow: React.FC<Props> = (props) => {
  const { colors } = useTheme()

  return (
    <Box width="full">
      <Slide
        indicators={(index) => (
          <Box
            className="indicator"
            width={3}
            height={3}
            marginX={2}
            borderRadius="full"
            borderColor={colors.borderColor}
            borderWidth={1}
            borderStyle="solid"
          />
        )}
      >
        {props.images.map((image, index) => (
          <Flex width="full" justifyContent="center" key={index}>
            <Image
              key={index}
              src={image.url}
              width={370}
              height={500}
              alt={image.caption}
            />
          </Flex>
        ))}
      </Slide>
    </Box>
  )
}
