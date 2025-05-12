import mongoose from "mongoose";
import { type } from "os";
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: [true, "saxeli bj"] },
  price: {
    type: Number,
    required: true,
    validate: {
      validator: (val) => val > 30,
      message: "price must be greater than 30",
    },
  },
  description: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  slug: { type: String },
  createdAt: { type: Date, default: Date.now },
});
productSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
const Product = mongoose.model("Product", productSchema);

export default Product;
