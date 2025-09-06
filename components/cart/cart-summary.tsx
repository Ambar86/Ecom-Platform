"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/cart-utils"
import { ShoppingBag, CreditCard } from "lucide-react"
import type { Cart } from "@/types/cart"

interface CartSummaryProps {
  cart: Cart
  onCheckout?: () => void
}

export function CartSummary({ cart, onCheckout }: CartSummaryProps) {
  const { items, totalAmount, itemCount } = cart

  // Calculate additional fees (placeholder for now)
  const subtotal = totalAmount
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items ({itemCount})</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Shipping
            {subtotal > 50 && <span className="text-green-600 ml-1">(Free)</span>}
          </span>
          <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">{formatPrice(total)}</span>
        </div>

        {/* Free Shipping Notice */}
        {subtotal < 50 && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            Add {formatPrice(50 - subtotal)} more for free shipping!
          </div>
        )}

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Proceed to Checkout
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-muted-foreground text-center">🔒 Secure checkout with 256-bit SSL encryption</p>
      </CardContent>
    </Card>
  )
}
