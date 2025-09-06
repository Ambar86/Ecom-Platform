// TypeScript interfaces for items/products

export interface Item {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  createdAt: Date
}

export interface ItemsResponse {
  items: Item[]
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
    hasNextPage: boolean
    hasPrevPage: boolean
    limit: number
  }
  filters: {
    category?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    inStock?: string
    sortBy: string
    sortOrder: string
  }
}

export interface CreateItemRequest {
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

export interface UpdateItemRequest extends Partial<CreateItemRequest> {}

export interface CategoryData {
  name: string
  count: number
}

export interface SearchSuggestion {
  _id: string
  name: string
  category: string
  price: number
  image: string
}

export interface SearchResponse {
  suggestions: SearchSuggestion[]
  categoryMatches: string[]
  total: number
}
