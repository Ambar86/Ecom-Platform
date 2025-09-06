import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    })

    // Return user data (without password) and token
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }

    return NextResponse.json({
      message: "Login successful",
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
