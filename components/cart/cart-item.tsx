"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/cart-utils"
import { Plus, Minus, Trash2, ExternalLink } from "lucide-react"
import type { CartItem } from "@/types/cart"

interface CartItemProps {
  cartItem: CartItem
}

export function CartItemComponent({ cartItem }: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { updateQuantity, removeFromCart } = useCart()

  const { item, quantity, price } = cartItem
  const subtotal = price * quantity

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > item.stock) return

    setIsLoading(true)
    try {
      await updateQuantity(item._id, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setIsLoading(true)
    try {
      await removeFromCart(item._id)
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, 128px"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="space-y-1">
                <Badge variant="secondary" className="text-xs w-fit">
                  {item.category}
                </Badge>
                <Link href={`/products/${item._id}`} className="block group">
                  <h3 className="font-semibold text-card-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                    {item.name}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-semibold text-lg text-card-foreground">{formatPrice(price)}</p>
                <p className="text-sm text-muted-foreground">per item</p>
              </div>
            </div>

            {/* Quantity Controls and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-card-foreground">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantity - 1)}
                    disabled={isLoading || quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-medium min-w-[3rem] text-center text-card-foreground">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantity + 1)}
                    disabled={isLoading || quantity >= item.stock}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">({item.stock} available)</span>
              </div>

              {/* Subtotal and Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="font-bold text-lg text-card-foreground">{formatPrice(subtotal)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
