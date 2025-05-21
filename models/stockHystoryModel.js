import mongoose from "mongoose";

const stockHystorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    changeDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
const stockHystory = mongoose.model("StockHystory", stockHystorySchema);
export default stockHystory;
