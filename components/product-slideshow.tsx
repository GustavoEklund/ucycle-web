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
      {props.images.length === 1 ? (
        <Flex
          height={420}
          justifyContent="center"
          position="relative"
          width="full"
        >
          <Image
            src={props.images[0].url}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt={props.images[0].caption}
          />
        </Flex>
      ) : (
        <Slide
          transitionDuration={150}
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
            <Flex
              key={index}
              height={500}
              justifyContent="center"
              position="relative"
              width="full"
            >
              <Image
                key={index}
                src={image.url}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                alt={image.caption}
              />
            </Flex>
          ))}
        </Slide>
      )}
    </Box>
  )
}
