import mongoose, { model } from "mongoose";
import stockHystory from "./stockHystoryModel.js";
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
    archived: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

///////////////////////////////////

// productSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();
//   if (!update.stock) return next();
//   const product = await this.model.findOne(this.getQuery());
//   if (update.stock === product.stock) return next();
//   await stockHystory.create({
//     productId: product._id,
//     prevStock: product.stock,
//     currentStock: update.stock,
//   });
// });

// productSchema.pre("findOneAndDelete", async function (next) {
//   const query = this.getQuery();
//   try {
//     await this.model.findOneAndUpdate(query, {
//       archived: true,
//     });
//     this.setQuery({ id: -1 });
//     next();
//   } catch (err) {
//     console.log(err.message);
//     next();
//   }
// });

productSchema.post("save", function (doc) {
  console.log("product saved", doc);
});
productSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

/////////////////

productSchema.statics.softDelete = async function (filter) {
  return await this.findOneAndUpdate(
    filter,
    {
      archived: true,
    },
    { new: true }
  );
};

////////////////////

productSchema.virtual("status").get(function () {
  return this.stock > 0 ? "avaialble" : "not available";
});
productSchema.virtual("priceWithTax").get(function () {
  return this.price * 1.2;
});
productSchema.virtual("capacity").get(function () {
  return this.price * this.stock;
});

const Product = mongoose.model("Product", productSchema);

export default Product;
