import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { signToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password, name } = await request.json()

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    })

    await user.save()

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

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userData,
        token,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Signup error:", error)

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
