import type { NextRequest } from "next/server"
import { verifyToken } from "./jwt"

export function getAuthUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    return decoded
  } catch (error) {
    return null
  }
}

export function requireAuth(request: NextRequest) {
  const user = getAuthUser(request)

  if (!user) {
    throw new Error("Authentication required")
  }

  return user
}
