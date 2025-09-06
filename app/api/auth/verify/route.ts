import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth-middleware"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Create a mock request with the token to verify it
    const mockRequest = new NextRequest("http://localhost", {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    const user = getAuthUser(mockRequest)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      user: {
        userId: user.userId,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
