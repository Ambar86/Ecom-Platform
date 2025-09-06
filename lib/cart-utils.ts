// Utility functions for cart operations

export interface CartItem {
  item: {
    _id: string
    name: string
    description: string
    price: number
    image: string
    stock: number
    category: string
  }
  quantity: number
  price: number
}

export interface Cart {
  id: string
  items: CartItem[]
  totalAmount: number
  itemCount: number
}

export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price)
}

export function validateCartItem(item: any, quantity: number): string | null {
  if (!item) {
    return "Item not found"
  }

  if (item.stock === 0) {
    return "Item is out of stock"
  }

  if (quantity > item.stock) {
    return `Only ${item.stock} items available in stock`
  }

  if (quantity < 1) {
    return "Quantity must be at least 1"
  }

  return null
}

export function getCartItemById(cart: Cart, itemId: string): CartItem | null {
  return cart.items.find((item) => item.item._id === itemId) || null
}

export function isItemInCart(cart: Cart, itemId: string): boolean {
  return cart.items.some((item) => item.item._id === itemId)
}

export function getCartSummary(cart: Cart) {
  return {
    itemCount: cart.itemCount,
    totalAmount: cart.totalAmount,
    formattedTotal: formatPrice(cart.totalAmount),
    isEmpty: cart.items.length === 0,
  }
}
