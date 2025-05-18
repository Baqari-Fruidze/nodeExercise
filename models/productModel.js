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
    archived: { type: Boolean, default: false },
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

// productSchema.pre("findOneAndDelete", async function (next) {
//   try {
//     const query = this.getQuery();
//     const product = await this.model.findOne(query);

//     if (!product) {
//       return next(); // Nothing to delete
//     }

//     if (product.stock > 0) {
//       return next(new Error("Cannot delete product, it is still in stock."));
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });
// productSchema.pre("findOneAndDelete", async function (next) {
//   const query = this.getQuery(); // get the deletion query
//   const product = await this.model.findOne(query);

//   if (!product) return next(); // no product found

//   if (product.archived) return next(); // already archived

//   // Instead of deleting, mark as archived
//   await this.model.findOneAndUpdate(query, { archived: true });

//   // Cancel the actual delete by not calling next()
//   // Instead, throw to stop it (or return nothing)
//   return next(new Error("Soft-deleted: Product archived instead of deleted"));
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

    if (product.archived) {
      return next(); // already archived, allow deletion if necessary
    }

    // Instead of deleting, mark as archived
    await this.model.findOneAndUpdate(query, { archived: true });

    // Prevent actual deletion
    return next(new Error("Soft-deleted: Product archived instead of deleted"));
  } catch (err) {
    next(err);
  }
});

// productSchema.statics.unarchive = async function (query) {
//   return this.findOneAndUpdate(query, { archived: false }, { new: true });
// };

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
