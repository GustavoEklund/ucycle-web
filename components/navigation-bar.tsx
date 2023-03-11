import React from 'react'
import { Avatar, HStack, IconButton, Link, useTheme } from '@chakra-ui/react'
import { BiHome, BiMessageDetail, BiSearchAlt } from 'react-icons/bi'
import { AiOutlineTags } from 'react-icons/ai'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export const NavigationBar: React.FC = () => {
  const theme = useTheme()
  const { asPath } = useRouter()

  return (
    <HStack
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      width="full"
      justifyContent="space-around"
      paddingY={2}
      paddingX={4}
      borderTopStyle="solid"
      borderTopWidth={1}
      borderTopColor={theme.colors.borderColor}
      backgroundColor="var(--chakra-colors-chakra-body-bg)"
    >
      <NextLink href="/" passHref>
        <Link>
          <IconButton
            aria-label="home"
            icon={<BiHome size={24} />}
            variant={asPath === '/' ? 'solid' : 'ghost'}
          />
        </Link>
      </NextLink>
      <IconButton aria-label="home" icon={<BiSearchAlt size={24} />} variant="ghost" />
      <IconButton aria-label="home" icon={<AiOutlineTags size={24} />} variant="ghost" />
      <IconButton aria-label="home" icon={<BiMessageDetail size={24} />} variant="ghost" />
      <NextLink href="/profile" passHref>
        <Link>
          <IconButton
            aria-label="profile"
            icon={<Avatar size="sm" />}
            variant={asPath === '/profile' ? 'solid' : 'ghost'}
          />
        </Link>
      </NextLink>
    </HStack>
  )
}
