const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const { authenticateToken } = require("./user.auth.js");

//add book to fav
router.put("/add-book-to-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFav = userData.favourite.includes(bookid);
    if (isBookFav) {
      return res.json({
        status: "Failed",
        message: "Book is already exist in favourite",
      });
    }
    await User.findByIdAndUpdate(id, { $push: { favourite: bookid } });
    return res.json({ status: "Success", message: "Book added to favorite" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
//delete book from favourite
router.put("/delete-book-from-fav", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFav = userData.favourite.includes(bookid);
    if (isBookFav) {
      await User.findByIdAndUpdate(id, { $pull: { favourite: bookid } });
    }

    return res.json({
      status: "success",
      message: "Book is Removed from favorite",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//get favourite books from a particular user
router.get("/get-all-fav-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    if (!id) {
      return res.json({ message: "User ID is required" });
    }

    const userData = await User.findById(id).populate("favourite");

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!userData.favourite || userData.favourite.length === 0) {
      return res.json({ message: "No favourite books found for the user" });
    }

    return res
      .status(200)
      .json({ status: "Success", favbooks: userData.favourite });
  } catch (error) {
    console.error("Error fetching favourite books:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
