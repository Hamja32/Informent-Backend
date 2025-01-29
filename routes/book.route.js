const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./user.auth.js");
const Book = require("../models/book.js");

//add book : admin
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);
    if (user.role !== "Admin") {
      return res
        .status(400)
        .json({ message: "You are not having to perform admin work" });
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
//update book : admin
router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    const status = await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    if (status) {
      return res.json({
        status: "success",
        message: "Book updated succesfully",
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;

    const status = await Book.findByIdAndDelete(bookid);

    if (status) {
      console.log(status);
      res.status(200).json({ message: "Book Deleted Successfully" });
    } else {
      res.status(400).json({ message: "Book is not delete" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurrd" });
  }
});

router.get("/get-all-books", async (req, res) => {
  try {
    const all_books = await Book.find().sort({ createdAt: -1 });
    return res.json({ status: "success", data: all_books });
  } catch (error) {
    res.status(500).json({ message: "An error occurrd" });
  }
});
router.get("/get-recent-books", async (req, res) => {
  try {
    const recent_books = await Book.find().sort({ createdAt: -1 }).limit(4);
    return res.json({
      status: "Success",
      data: recent_books,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurrd" });
  }
});
router.get("/get-book-by-id/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specific_book = await Book.findById(id);

    return res.json({ status: "Success", data: specific_book });
  } catch (error) {
    res.status(500).json({ message: "An error " });
  }
});
module.exports = router;
