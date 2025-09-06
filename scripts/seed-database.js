// Node.js script to seed the MongoDB database with sample items
import connectDB from "../lib/mongodb.js"
import Item from "../models/Item.js"

const sampleItems = [
  // Electronics
  {
    name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with advanced camera system",
    price: 999.99,
    category: "Electronics",
    image: "/iphone-15-pro-hands.png",
    stock: 50,
  },
  {
    name: "MacBook Air M3",
    description: "Powerful laptop with M3 chip and all-day battery life",
    price: 1299.99,
    category: "Electronics",
    image: "/macbook-air-laptop.jpg",
    stock: 25,
  },
  {
    name: "AirPods Pro",
    description: "Wireless earbuds with active noise cancellation",
    price: 249.99,
    category: "Electronics",
    image: "/airpods-pro-earbuds.jpg",
    stock: 100,
  },
  // Clothing
  {
    name: "Premium Cotton T-Shirt",
    description: "Comfortable and stylish cotton t-shirt",
    price: 29.99,
    category: "Clothing",
    image: "/cotton-t-shirt.jpg",
    stock: 200,
  },
  {
    name: "Denim Jeans",
    description: "Classic blue denim jeans with perfect fit",
    price: 79.99,
    category: "Clothing",
    image: "/blue-denim-jeans.png",
    stock: 150,
  },
  {
    name: "Winter Jacket",
    description: "Warm and waterproof winter jacket",
    price: 149.99,
    category: "Clothing",
    image: "/winter-jacket.png",
    stock: 75,
  },
  // Books
  {
    name: "The Art of Programming",
    description: "Comprehensive guide to software development",
    price: 49.99,
    category: "Books",
    image: "/programming-book.png",
    stock: 80,
  },
  {
    name: "Modern Web Design",
    description: "Learn the latest web design techniques",
    price: 39.99,
    category: "Books",
    image: "/web-design-book.jpg",
    stock: 60,
  },
  // Home
  {
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with AI assistant",
    price: 99.99,
    category: "Home",
    image: "/smart-speaker.png",
    stock: 120,
  },
  {
    name: "Coffee Maker",
    description: "Automatic coffee maker with programmable settings",
    price: 129.99,
    category: "Home",
    image: "/modern-coffee-maker.png",
    stock: 40,
  },
]

async function seedDatabase() {
  try {
    await connectDB()

    // Clear existing items
    await Item.deleteMany({})
    console.log("Cleared existing items")

    // Insert sample items
    const items = await Item.insertMany(sampleItems)
    console.log(`Seeded ${items.length} items successfully`)

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
