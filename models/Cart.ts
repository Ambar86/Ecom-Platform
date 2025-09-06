import mongoose, { type Document, Schema } from "mongoose"

export interface ICartItem {
  item: string // Item ID
  quantity: number
  price: number
}

export interface ICart extends Document {
  _id: string
  user: string // User ID
  items: ICartItem[]
  totalAmount: number
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
  item: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
})

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Calculate total amount before saving
CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
  next()
})

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
