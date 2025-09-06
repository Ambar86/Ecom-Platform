"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { Eye, EyeOff, ShoppingBag, Check, X } from "lucide-react"

interface PasswordStrength {
  score: number
  feedback: string[]
  color: string
}

export function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { signup } = useAuth()
  const router = useRouter()

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    const feedback: string[] = []

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push("At least 8 characters")
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One uppercase letter")
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push("One lowercase letter")
    }

    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push("One number")
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push("One special character")
    }

    let color = "text-destructive"
    if (score >= 4) color = "text-green-600"
    else if (score >= 3) color = "text-yellow-600"
    else if (score >= 2) color = "text-orange-600"

    return { score, feedback, color }
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 3) {
      setError("Password is too weak. Please follow the requirements.")
      setIsLoading(false)
      return
    }

    if (!formData.acceptTerms) {
      setError("Please accept the terms and conditions")
      setIsLoading(false)
      return
    }

    try {
      await signup(formData.email, formData.password, formData.name)
      router.push("/") // Redirect to home page after successful signup
    } catch (err: any) {
      setError(err.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">ShopHub</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground">Join our community</h2>
          <p className="mt-2 text-muted-foreground">Create your account and start shopping</p>
        </div>

        {/* Signup Form */}
        <Card className="bg-card border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-card-foreground">Create account</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-destructive/50 text-destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">
                  Full name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-card-foreground">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-card-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= passwordStrength.score
                              ? passwordStrength.score >= 4
                                ? "bg-green-600"
                                : passwordStrength.score >= 3
                                  ? "bg-yellow-600"
                                  : "bg-orange-600"
                              : "bg-border"
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="text-xs space-y-1">
                        <p className="text-muted-foreground">Password requirements:</p>
                        {passwordStrength.feedback.map((item, index) => (
                          <div key={index} className="flex items-center space-x-1">
                            <X className="h-3 w-3 text-destructive" />
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-card-foreground">
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <div className="flex items-center space-x-1">
                    <X className="h-3 w-3 text-destructive" />
                    <span className="text-xs text-destructive">Passwords do not match</span>
                  </div>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center space-x-1">
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-xs text-green-600">Passwords match</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: checked as boolean }))}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">🔒 Your data is protected with industry-standard encryption</p>
          <p className="text-xs text-muted-foreground">Join thousands of satisfied customers</p>
        </div>
      </div>
    </div>
  )
}
