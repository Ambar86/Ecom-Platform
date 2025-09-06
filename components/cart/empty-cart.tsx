import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, ArrowRight } from "lucide-react"

export function EmptyCart() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
          </div>

          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/" className="flex items-center gap-2">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="text-sm text-muted-foreground">
            <p>Need help finding something?</p>
            <Link href="/contact" className="text-accent hover:text-accent/80 transition-colors">
              Contact our support team
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
