import mongoose, { type Document, Schema } from "mongoose"

export interface IItem extends Document {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
  createdAt: Date
}

const ItemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Item description is required"],
  },
  price: {
    type: Number,
    required: [true, "Item price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Item category is required"],
    enum: ["Electronics", "Clothing", "Books", "Home", "Sports", "Beauty", "Other"],
  },
  image: {
    type: String,
    required: [true, "Item image is required"],
  },
  stock: {
    type: Number,
    required: [true, "Stock quantity is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema)
