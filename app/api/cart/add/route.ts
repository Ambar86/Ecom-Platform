import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Item from "@/models/Item"
import { requireAuth } from "@/lib/auth-middleware"
import mongoose from "mongoose"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user
    const authUser = requireAuth(request)

    const { itemId, quantity = 1 } = await request.json()

    // Validate input
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 })
    }

    // Check if item exists and is in stock
    const item = await Item.findById(itemId)
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (item.stock < quantity) {
      return NextResponse.json({ error: `Only ${item.stock} items available in stock` }, { status: 400 })
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: authUser.userId })
    if (!cart) {
      cart = new Cart({
        user: authUser.userId,
        items: [],
      })
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((cartItem: any) => cartItem.item.toString() === itemId)

    if (existingItemIndex > -1) {
      // Update quantity of existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity

      // Check stock availability for new quantity
      if (newQuantity > item.stock) {
        return NextResponse.json(
          {
            error: `Cannot add ${quantity} more. Only ${item.stock - cart.items[existingItemIndex].quantity} more available`,
          },
          { status: 400 },
        )
      }

      cart.items[existingItemIndex].quantity = newQuantity
      cart.items[existingItemIndex].price = item.price // Update price in case it changed
    } else {
      // Add new item to cart
      cart.items.push({
        item: itemId,
        quantity,
        price: item.price,
      })
    }

    await cart.save()

    // Populate item details for response
    await cart.populate({
      path: "items.item",
      model: "Item",
      select: "name description price image stock category",
    })

    return NextResponse.json({
      message: "Item added to cart successfully",
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.reduce((total: number, item: any) => total + item.quantity, 0),
      },
    })
  } catch (error: any) {
    console.error("Add to cart error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
