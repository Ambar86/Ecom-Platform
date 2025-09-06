"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/layout/header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { CartItemComponent } from "@/components/cart/cart-item"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import { useCart } from "@/hooks/use-cart"
import { ArrowLeft, Trash2, Loader2, AlertCircle } from "lucide-react"

export default function CartPage() {
  const [isClearing, setIsClearing] = useState(false)
  const { cart, isLoading, error, clearCart } = useCart()

  const handleClearCart = async () => {
    if (!cart || cart.items.length === 0) return

    const confirmed = window.confirm(
      "Are you sure you want to remove all items from your cart? This action cannot be undone.",
    )

    if (!confirmed) return

    setIsClearing(true)
    try {
      await clearCart()
    } catch (error) {
      console.error("Failed to clear cart:", error)
    } finally {
      setIsClearing(false)
    }
  }

  const handleCheckout = () => {
    // Placeholder for checkout functionality
    alert("Checkout functionality would be implemented here!")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
                {cart && cart.items.length > 0 && (
                  <p className="text-muted-foreground">
                    {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart
                  </p>
                )}
              </div>
            </div>

            {/* Clear Cart Button */}
            {cart && cart.items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
              >
                {isClearing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Clear Cart
              </Button>
            )}
          </div>

          {/* Error State */}
          {error && (
            <Alert className="mb-6 border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Loading your cart...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Empty Cart */}
          {!isLoading && cart && cart.items.length === 0 && <EmptyCart />}

          {/* Cart Content */}
          {!isLoading && cart && cart.items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((cartItem) => (
                  <CartItemComponent key={cartItem.item._id} cartItem={cartItem} />
                ))}
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary cart={cart} onCheckout={handleCheckout} />
              </div>
            </div>
          )}

          {/* Recommended Products Section */}
          {!isLoading && cart && cart.items.length > 0 && (
            <div className="mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground mb-4">You might also like</h2>
                <p className="text-muted-foreground mb-6">Discover more products that complement your selection</p>
                <Button variant="outline" asChild>
                  <Link href="/">Browse More Products</Link>
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
