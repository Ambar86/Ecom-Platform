"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { formatPrice } from "@/lib/cart-utils"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import type { Item } from "@/types/item"

interface ProductCardProps {
  item: Item
}

export function ProductCard({ item }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addToCart, updateQuantity, getItemQuantity, isItemInCart } = useCart()
  const { isAuthenticated } = useAuth()

  const currentQuantity = getItemQuantity(item._id)
  const inCart = isItemInCart(item._id)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
      return
    }

    setIsLoading(true)
    try {
      if (inCart) {
        await updateQuantity(item._id, currentQuantity + 1)
      } else {
        await addToCart(item._id, 1)
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsLoading(true)
    try {
      await updateQuantity(item._id, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="group overflow-hidden border-border bg-card hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {item.category}
          </Badge>

          <Link href={`/products/${item._id}`}>
            <h3 className="font-semibold text-card-foreground hover:text-accent transition-colors line-clamp-2">
              {item.name}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-card-foreground">{formatPrice(item.price)}</span>
            <span className="text-sm text-muted-foreground">{item.stock} in stock</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {item.stock === 0 ? (
          <Button disabled className="w-full">
            Out of Stock
          </Button>
        ) : inCart ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(currentQuantity - 1)}
                disabled={isLoading || currentQuantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium min-w-[2rem] text-center">{currentQuantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateQuantity(currentQuantity + 1)}
                disabled={isLoading || currentQuantity >= item.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/cart">
              <Button variant="outline" size="sm">
                View Cart
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              "Adding..."
            ) : showSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
