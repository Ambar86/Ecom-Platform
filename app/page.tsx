"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductGrid } from "@/components/products/product-grid"
import { itemsApi } from "@/lib/api-client"
import type { ItemsResponse } from "@/types/item"

export default function HomePage() {
  const [data, setData] = useState<ItemsResponse | null>(null)
  const [categories, setCategories] = useState<Array<{ name: string; count: number }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()

  // Build filters from URL params
  const filters = {
    category: searchParams.get("category") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    search: searchParams.get("search") || undefined,
    inStock: searchParams.get("inStock") || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: searchParams.get("page") || "1",
  }

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Remove undefined values
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== undefined))

      const response = await itemsApi.getItems(cleanFilters)
      setData(response)
    } catch (err: any) {
      setError(err.message || "Failed to load products")
      console.error("Failed to load products:", err)
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  const loadCategories = useCallback(async () => {
    try {
      const response = await itemsApi.getCategories()
      setCategories(response.categories)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const handleFiltersChange = (newFilters: Record<string, string>) => {
    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      }
    })

    // Always reset to page 1 when filters change
    params.delete("page")

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)

    // Trigger reload
    loadProducts()
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", page.toString())

    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, "", newUrl)

    // Trigger reload
    loadProducts()
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <ProductFilters filters={filters} categories={categories} onFiltersChange={handleFiltersChange} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            {data && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {filters.search ? `Search results for "${filters.search}"` : "All Products"}
                </h1>
                <p className="text-muted-foreground">
                  {data.pagination.totalCount} products found
                  {filters.category && filters.category !== "all" && ` in ${filters.category}`}
                </p>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid
              items={data?.items || []}
              isLoading={isLoading}
              pagination={data?.pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
