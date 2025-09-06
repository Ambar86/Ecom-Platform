import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { requireAuth } from "@/lib/auth-middleware"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get authenticated user from token
    const authUser = requireAuth(request)

    // Find user in database
    const user = await User.findById(authUser.userId).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user data
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      user: userData,
    })
  } catch (error: any) {
    console.error("Get user error:", error)

    if (error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
