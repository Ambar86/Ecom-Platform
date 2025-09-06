import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Item from "@/models/Item"
import { getAuthUser } from "@/lib/auth-middleware"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { id } = params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    const item = await Item.findById(id)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item })
  } catch (error) {
    console.error("Get item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Check authentication
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { id } = params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    const updateData = await request.json()

    // Remove fields that shouldn't be updated directly
    delete updateData._id
    delete updateData.createdAt

    const item = await Item.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Item updated successfully",
      item,
    })
  } catch (error: any) {
    console.error("Update item error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    // Check authentication
    const authUser = getAuthUser(request)
    if (!authUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { id } = params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    const item = await Item.findByIdAndDelete(id)

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Item deleted successfully",
    })
  } catch (error) {
    console.error("Delete item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
