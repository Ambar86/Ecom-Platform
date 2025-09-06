import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Since we're using JWT tokens stored on the client side,
    // logout is handled by the client removing the token
    // This endpoint exists for consistency and future server-side session management

    return NextResponse.json({
      message: "Logout successful",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
