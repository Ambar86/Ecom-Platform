"use client"

import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Package } from "lucide-react"
import type { Item } from "@/types/item"

interface ProductGridProps {
  items: Item[]
  isLoading?: boolean
  pagination?: {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  onPageChange?: (page: number) => void
}

export function ProductGrid({ items, isLoading, pagination, onPageChange }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search terms to find what you're looking for.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => onPageChange?.(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum: number
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = pagination.currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === pagination.currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange?.(pageNum)}
                  className={pageNum === pagination.currentPage ? "bg-primary text-primary-foreground" : ""}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            onClick={() => onPageChange?.(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
