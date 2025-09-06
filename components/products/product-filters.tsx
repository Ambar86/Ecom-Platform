"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, Filter, X } from "lucide-react"
import { CATEGORIES, PRICE_RANGES, SORT_OPTIONS } from "@/lib/item-filters"

interface ProductFiltersProps {
  filters: {
    category?: string
    minPrice?: string
    maxPrice?: string
    search?: string
    inStock?: string
    sortBy?: string
    sortOrder?: string
  }
  onFiltersChange: (filters: Record<string, string>) => void
  categories?: Array<{ name: string; count: number }>
}

export function ProductFilters({ filters, onFiltersChange, categories = [] }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters }
    if (value === "" || value === "all") {
      delete newFilters[key]
    } else {
      newFilters[key] = value
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (range: { min: number; max: number | null }) => {
    const newFilters = { ...localFilters }
    newFilters.minPrice = range.min.toString()
    if (range.max !== null) {
      newFilters.maxPrice = range.max.toString()
    } else {
      delete newFilters.maxPrice
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount = Object.keys(localFilters).filter((key) => key !== "sortBy" && key !== "sortOrder").length

  return (
    <div className="space-y-4">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <FilterContent
              localFilters={localFilters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onPriceRangeChange={handlePriceRangeChange}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:block">
        <FilterContent
          localFilters={localFilters}
          categories={categories}
          onFilterChange={handleFilterChange}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
        />
      </div>
    </div>
  )
}

interface FilterContentProps {
  localFilters: Record<string, string>
  categories: Array<{ name: string; count: number }>
  onFilterChange: (key: string, value: string) => void
  onPriceRangeChange: (range: { min: number; max: number | null }) => void
  onClearFilters: () => void
  activeFilterCount: number
}

function FilterContent({
  localFilters,
  categories,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
  activeFilterCount,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={`${localFilters.sortBy || "createdAt"}-${localFilters.sortOrder || "desc"}`}
            onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split("-")
              onFilterChange("sortBy", sortBy)
              onFilterChange("sortOrder", sortOrder)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-categories"
              checked={!localFilters.category || localFilters.category === "all"}
              onCheckedChange={() => onFilterChange("category", "all")}
            />
            <Label htmlFor="all-categories" className="text-sm">
              All Categories
            </Label>
          </div>
          {(categories.length > 0 ? categories : CATEGORIES.map((cat) => ({ name: cat, count: 0 }))).map((category) => (
            <div key={category.name} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.name}`}
                checked={localFilters.category === category.name}
                onCheckedChange={() => onFilterChange("category", category.name)}
              />
              <Label htmlFor={`category-${category.name}`} className="text-sm flex-1">
                {category.name}
                {category.count > 0 && <span className="text-muted-foreground ml-1">({category.count})</span>}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRICE_RANGES.map((range, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`price-${index}`}
                checked={
                  localFilters.minPrice === range.min.toString() &&
                  (range.max === null ? !localFilters.maxPrice : localFilters.maxPrice === range.max.toString())
                }
                onCheckedChange={() => onPriceRangeChange(range)}
              />
              <Label htmlFor={`price-${index}`} className="text-sm">
                {range.label}
              </Label>
            </div>
          ))}

          {/* Custom Price Range */}
          <div className="pt-2 border-t border-border">
            <Label className="text-sm font-medium">Custom Range</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice || ""}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="text-sm"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice || ""}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={localFilters.inStock === "true"}
              onCheckedChange={(checked) => onFilterChange("inStock", checked ? "true" : "")}
            />
            <Label htmlFor="in-stock" className="text-sm">
              In Stock Only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={onClearFilters} className="w-full bg-transparent">
          <X className="mr-2 h-4 w-4" />
          Clear Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )
}
