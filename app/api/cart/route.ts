import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user
    const authUser = requireAuth(request)

    // Find user's cart and populate item details
    let cart = await Cart.findOne({ user: authUser.userId }).populate({
      path: "items.item",
      model: "Item",
      select: "name description price image stock category",
    })

    // If no cart exists, create an empty one
    if (!cart) {
      cart = new Cart({
        user: authUser.userId,
        items: [],
        totalAmount: 0,
      })
      await cart.save()
    }

    // Filter out items that no longer exist or are out of stock
    const validItems = cart.items.filter((cartItem: any) => {
      return cartItem.item && cartItem.item.stock > 0
    })

    // Update cart if items were filtered out
    if (validItems.length !== cart.items.length) {
      cart.items = validItems
      await cart.save()
    }

    return NextResponse.json({
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount: cart.totalAmount,
        itemCount: cart.items.reduce((total: number, item: any) => total + item.quantity, 0),
      },
    })
  } catch (error: any) {
    console.error("Get cart error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user
    const authUser = requireAuth(request)

    // Clear user's cart
    const cart = await Cart.findOneAndUpdate(
      { user: authUser.userId },
      { items: [], totalAmount: 0 },
      { new: true, upsert: true },
    )

    return NextResponse.json({
      message: "Cart cleared successfully",
      cart: {
        id: cart._id,
        items: [],
        totalAmount: 0,
        itemCount: 0,
      },
    })
  } catch (error: any) {
    console.error("Clear cart error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
