// TypeScript interfaces for cart functionality

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

export interface CartResponse {
  cart: Cart
  message?: string
}

export interface AddToCartRequest {
  itemId: string
  quantity?: number
}

export interface UpdateCartRequest {
  itemId: string
  quantity: number
}

export interface RemoveFromCartRequest {
  itemId: string
}

export interface CartState {
  cart: Cart | null
  isLoading: boolean
  error: string | null
}
