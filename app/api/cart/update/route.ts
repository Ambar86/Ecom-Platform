import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Item from "@/models/Item"
import { requireAuth } from "@/lib/auth-middleware"
import mongoose from "mongoose"

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user
    const authUser = requireAuth(request)

    const { itemId, quantity } = await request.json()

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

    // Find user's cart
    const cart = await Cart.findOne({ user: authUser.userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Find item in cart
    const cartItemIndex = cart.items.findIndex((cartItem: any) => cartItem.item.toString() === itemId)
    if (cartItemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    // Check item stock availability
    const item = await Item.findById(itemId)
    if (!item) {
      return NextResponse.json({ error: "Item no longer exists" }, { status: 404 })
    }

    if (quantity > item.stock) {
      return NextResponse.json({ error: `Only ${item.stock} items available in stock` }, { status: 400 })
    }

    // Update quantity and price
    cart.items[cartItemIndex].quantity = quantity
    cart.items[cartItemIndex].price = item.price // Update price in case it changed

    await cart.save()

    // Populate item details for response
    await cart.populate({
      path: "items.item",
      model: "Item",
      select: "name description price image stock category",
    })

    return NextResponse.json({
      message: "Cart updated successfully",
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.reduce((total: number, item: any) => total + item.quantity, 0),
      },
    })
  } catch (error: any) {
    console.error("Update cart error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
