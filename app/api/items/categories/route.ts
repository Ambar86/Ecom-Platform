import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Item from "@/models/Item"

export async function GET() {
  try {
    await connectDB()

    // Get all unique categories from items
    const categories = await Item.distinct("category")

    // Get category counts
    const categoryCounts = await Item.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Format response
    const categoryData = categories.map((category) => {
      const countData = categoryCounts.find((item) => item._id === category)
      return {
        name: category,
        count: countData ? countData.count : 0,
      }
    })

    return NextResponse.json({
      categories: categoryData,
    })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
