// Utility functions for item filtering and sorting

export interface ItemFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  inStock?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest First", order: "desc" },
  { value: "createdAt", label: "Oldest First", order: "asc" },
  { value: "price", label: "Price: Low to High", order: "asc" },
  { value: "price", label: "Price: High to Low", order: "desc" },
  { value: "name", label: "Name: A to Z", order: "asc" },
  { value: "name", label: "Name: Z to A", order: "desc" },
]

export const CATEGORIES = ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"]

export const PRICE_RANGES = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $500", min: 200, max: 500 },
  { label: "Over $500", min: 500, max: null },
]

export function buildItemQuery(filters: ItemFilters) {
  const query: any = {}

  if (filters.category && filters.category !== "all") {
    query.category = filters.category
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {}
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ]
  }

  if (filters.inStock) {
    query.stock = { $gt: 0 }
  }

  return query
}

export function buildSortObject(sortBy = "createdAt", sortOrder = "desc") {
  return { [sortBy]: sortOrder === "asc" ? 1 : -1 }
}

export function calculatePagination(page = 1, limit = 12, totalCount: number): PaginationInfo {
  const totalPages = Math.ceil(totalCount / limit)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    currentPage: page,
    totalPages,
    totalCount,
    hasNextPage,
    hasPrevPage,
    limit,
  }
}
