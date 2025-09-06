import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { requireAuth } from "@/lib/auth-middleware"
import mongoose from "mongoose"

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user
    const authUser = requireAuth(request)

    const { itemId } = await request.json()

    // Validate input
    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: authUser.userId })
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Remove item from cart
    const initialLength = cart.items.length
    cart.items = cart.items.filter((cartItem: any) => cartItem.item.toString() !== itemId)

    if (cart.items.length === initialLength) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    await cart.save()

    // Populate item details for response
    await cart.populate({
      path: "items.item",
      model: "Item",
      select: "name description price image stock category",
    })

    return NextResponse.json({
      message: "Item removed from cart successfully",
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.reduce((total: number, item: any) => total + item.quantity, 0),
      },
    })
  } catch (error: any) {
    console.error("Remove from cart error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
