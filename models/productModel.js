import mongoose from "mongoose";
import { type } from "os";
const productSchema = new mongoose.Schema(
  {
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
// productSchema.pre("findOneAndDelete", async function (next) {
//   console.log(this.getQuery());
//   const product = await this.model.findOne(this.getQuery());
//   if (product.stock > 0) {
//     throw new error("can not delete product,it is in stock");
//   }
//   next();
// });

productSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery();
    const product = await this.model.findOne(query);

    if (!product) {
      return next(); // Nothing to delete
    }

    if (product.stock > 0) {
      return next(new Error("Cannot delete product, it is still in stock."));
    }

    next();
  } catch (err) {
    next(err);
  }
});
productSchema.post("save", function (doc) {
  console.log("product saved", doc);
});
productSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});
productSchema.virtual("status").get(function () {
  return this.stock > 0 ? "avaialble" : "not available";
});
const Product = mongoose.model("Product", productSchema);

export default Product;
