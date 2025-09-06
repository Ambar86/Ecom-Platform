// API client utilities for making authenticated requests

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class ApiClient {
  private token: string | null = null

  constructor(token?: string) {
    this.token = token || null
  }

  setToken(token: string) {
    this.token = token
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Create a default instance
export const apiClient = new ApiClient()

// Auth-specific API calls
export const authApi = {
  signup: (data: { email: string; password: string; name: string }) => apiClient.post("/api/auth/signup", data),

  login: (data: { email: string; password: string }) => apiClient.post("/api/auth/login", data),

  logout: () => apiClient.post("/api/auth/logout"),

  getMe: () => apiClient.get("/api/auth/me"),

  verifyToken: (token: string) => apiClient.post("/api/auth/verify", { token }),
}

// Item-specific API calls
export const itemsApi = {
  getItems: (filters?: Record<string, string>) => {
    const params = new URLSearchParams(filters)
    return apiClient.get(`/api/items?${params.toString()}`)
  },

  getItem: (id: string) => apiClient.get(`/api/items/${id}`),

  createItem: (data: any) => apiClient.post("/api/items", data),

  updateItem: (id: string, data: any) => apiClient.put(`/api/items/${id}`, data),

  deleteItem: (id: string) => apiClient.delete(`/api/items/${id}`),

  getCategories: () => apiClient.get("/api/items/categories"),

  searchItems: (query: string) => apiClient.get(`/api/items/search?q=${encodeURIComponent(query)}`),
}

// Cart-specific API calls
export const cartApi = {
  getCart: () => apiClient.get("/api/cart"),

  addToCart: (data: { itemId: string; quantity?: number }) => apiClient.post("/api/cart/add", data),

  updateCart: (data: { itemId: string; quantity: number }) => apiClient.put("/api/cart/update", data),

  removeFromCart: (data: { itemId: string }) => apiClient.delete("/api/cart/remove", data),

  clearCart: () => apiClient.delete("/api/cart"),
}
