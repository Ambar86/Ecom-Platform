import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Item from "@/models/Item"
import { getAuthUser } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    // Build filter object
    const filter: any = {}

    // Category filter
    const category = searchParams.get("category")
    if (category && category !== "all") {
      filter.category = category
    }

    // Price range filter
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }

    // Search filter
    const search = searchParams.get("search")
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Stock filter (only show items in stock)
    const inStock = searchParams.get("inStock")
    if (inStock === "true") {
      filter.stock = { $gt: 0 }
    }

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const skip = (page - 1) * limit

    // Sort options
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1
    const sort: any = { [sortBy]: sortOrder }

    // Execute query
    const [items, totalCount] = await Promise.all([
      Item.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Item.countDocuments(filter),
    ])

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return NextResponse.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
      },
      filters: {
        category,
        minPrice,
        maxPrice,
        search,
        inStock,
        sortBy,
        sortOrder: sortOrder === 1 ? "asc" : "desc",
      },
    })
  } catch (error) {
    console.error("Get items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Check authentication (for admin functionality)
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const itemData = await request.json()

    // Validate required fields
    const { name, description, price, category, image, stock } = itemData
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return NextResponse.json(
        { error: "All fields are required: name, description, price, category, image, stock" },
        { status: 400 },
      )
    }

    // Create new item
    const item = new Item({
      name,
      description,
      price: Number.parseFloat(price),
      category,
      image,
      stock: Number.parseInt(stock),
    })

    await item.save()

    return NextResponse.json(
      {
        message: "Item created successfully",
        item,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create item error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
