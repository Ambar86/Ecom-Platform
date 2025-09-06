"use client"

import { useState, useEffect } from "react"
import { cartApi } from "@/lib/api-client"
import { useAuth } from "@/contexts/auth-context"
import type { Cart } from "@/types/cart"

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // Load cart when user is authenticated
  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated) {
      loadCart()
    } else {
      setCart(null)
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await cartApi.getCart()
      setCart(response.cart)
    } catch (err: any) {
      setError(err.message)
      console.error("Failed to load cart:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (itemId: string, quantity = 1) => {
    try {
      setError(null)
      const response = await cartApi.addToCart({ itemId, quantity })
      setCart(response.cart)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setError(null)
      const response = await cartApi.updateCart({ itemId, quantity })
      setCart(response.cart)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null)
      const response = await cartApi.removeFromCart({ itemId })
      setCart(response.cart)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const clearCart = async () => {
    try {
      setError(null)
      const response = await cartApi.clearCart()
      setCart(response.cart)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  const getItemQuantity = (itemId: string): number => {
    if (!cart) return 0
    const cartItem = cart.items.find((item) => item.item._id === itemId)
    return cartItem ? cartItem.quantity : 0
  }

  const isItemInCart = (itemId: string): boolean => {
    return getItemQuantity(itemId) > 0
  }

  return {
    cart,
    isLoading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    isItemInCart,
    refreshCart: loadCart,
  }
}
