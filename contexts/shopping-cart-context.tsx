import React from 'react'
import axios from 'axios'
import process from 'process'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type ShoppingCart = {
  id: string
  products: {
    id: string
    title: string
    priceInCents: number
    amount: number
    pictureUrl: string
  }[]
}

type ShoppingCartContextModel = {
  shoppingCart: ShoppingCart | undefined
  addProductToShoppingCart: (productId: string) => void
  createNewShoppingCart: () => void
}

const defaultShoppingCartContext: ShoppingCartContextModel = {
  shoppingCart: undefined,
  addProductToShoppingCart: () => {},
  createNewShoppingCart: () => {},
}

export const ShoppingCartContext = React.createContext<ShoppingCartContextModel>(defaultShoppingCartContext)

export const ShoppingCartProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const session = useSession()
  const router = useRouter()
  const [shoppingCart, setShoppingCart] = React.useState<ShoppingCart | undefined>(undefined)
  const [addedProductToken, setAddedProductToken] = React.useState<number>(0)
  const [requestNewShoppingCartToken, setRequestNewShoppingCartToken] = React.useState<number>(0)

  const createNewShoppingCart = React.useCallback(() => {
    window.localStorage.removeItem('shopping-cart-id')
    setShoppingCart(undefined)
    setRequestNewShoppingCartToken((token) => token + 1)
  }, [])

  React.useEffect(() => {
    if (!session.data?.accessToken) return
    if (window.localStorage.getItem('shopping-cart-id') !== null) return
    const controller = new AbortController()
    axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/shopping-cart`, {}, {
      headers: {
        'Authorization': `Bearer ${session.data.accessToken}`,
      },
      signal: controller.signal,
    })
    .then((response) => {
      if (response.status !== 200) return
      window.localStorage.setItem('shopping-cart-id', response.data.id)
    })
    .catch((error) => {
      window.localStorage.removeItem('shopping-cart-id')
      if (axios.isCancel(error)) return
      console.error(error)
    })
    return () => {
      controller.abort()
    }
  }, [session.data?.accessToken, requestNewShoppingCartToken])

  React.useEffect(() => {
    if (!session.data?.accessToken) return
    if (window.localStorage.getItem('shopping-cart-id') === null) return
    const shoppingCartId = window.localStorage.getItem('shopping-cart-id')
    const controller = new AbortController()
    axios.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/shopping-cart/${shoppingCartId}`, {
      headers: {
        'Authorization': `Bearer ${session.data.accessToken}`,
      },
      signal: controller.signal,
    })
    .then((response) => {
      if (response.status !== 200) return
      setShoppingCart(response.data)
    })
    .catch((error) => {
      window.localStorage.removeItem('shopping-cart-id')
      if (axios.isCancel(error)) return
      console.error(error)
    })
    return () => {
      controller.abort()
    }
  }, [session.data?.accessToken, addedProductToken])

  const addProductToShoppingCart = React.useCallback((productId: string) => {
    const shoppingCartId = localStorage.getItem('shopping-cart-id')
    if (shoppingCartId === null) return
    if (session.data === null) return
    if (!session.data?.accessToken) return
    axios.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/shopping-cart/${shoppingCartId}/add-product/${productId}`, {}, {
      headers: {
        'Authorization': `Bearer ${session.data.accessToken}`,
      },
    })
    .then((response) => {
      if (response.status !== 204) return
      setAddedProductToken((token) => token + 1)
      router.push(`/shopping-cart/${shoppingCartId}`).then(() => Promise.resolve()).catch(console.error)
    })
    .catch(console.error)
  }, [router, session.data])

  return (
    <ShoppingCartContext.Provider value={{ shoppingCart, addProductToShoppingCart, createNewShoppingCart }}>
      {children}
    </ShoppingCartContext.Provider>
  )
}
