import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Item from "@/models/Item"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        suggestions: [],
        message: "Query must be at least 2 characters long",
      })
    }

    // Search for items matching the query
    const suggestions = await Item.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    })
      .select("name category price image")
      .limit(10)
      .lean()

    // Also get unique category suggestions
    const categoryMatches = await Item.distinct("category", {
      category: { $regex: query, $options: "i" },
    })

    return NextResponse.json({
      suggestions,
      categoryMatches,
      total: suggestions.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
