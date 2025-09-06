// Utility functions for consistent API responses

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  details?: string[]
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(error: string, details?: string[]): ApiResponse {
  return {
    success: false,
    error,
    details,
  }
}

export function handleApiError(error: any) {
  console.error("API Error:", error)

  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((err: any) => err.message)
    return errorResponse("Validation failed", details)
  }

  if (error.name === "CastError") {
    return errorResponse("Invalid ID format")
  }

  if (error.code === 11000) {
    return errorResponse("Duplicate entry found")
  }

  return errorResponse("Internal server error")
}
