// Environment variable validation utility
export function validateEnvironmentVariables() {
  const requiredVars = {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  const missing = Object.entries(requiredVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
        "Please add them to your environment variables in v0 settings or Vercel dashboard."
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn(
      "JWT_SECRET should be at least 32 characters long for security"
    );
  }

  console.log("✅ All environment variables are properly configured");
}
