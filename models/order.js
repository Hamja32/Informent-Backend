const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    //user book status
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
    status: {
      type: String,
      default: "Order Placed",
      enum: ["Order Placed", "Out for delivery", "Canceled", "Delivered"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
