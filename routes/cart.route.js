const { authenticateToken } = require("./user.auth");
const router = require("express").Router();
const User = require("../models/user");

router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is already exit in your cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });
    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
    });
  }
});

//delete book from favourite
router.put(
  "/delete-book-from-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const { id } = req.headers;
      const userData = await User.findById(id);
      const isBookInCart = userData.cart.includes(bookid);
      if (isBookInCart) {
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      }

      return res.status(200).json({ message: "Book Removed from cart" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
//get cart books from a particular user
router.get("/get-all-cart-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("cart");
    const cart = userData.cart.reverse();

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!cart || cart.length === 0) {
      return res.json({ message: "No books found in cart for the user" });
    }

    return res.status(200).json({ status: "Success", books: cart });
  } catch (error) {
    console.error("Error fetching cart books:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
