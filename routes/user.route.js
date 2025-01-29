const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passwordHashing = require("password-hash");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./user.auth.js");

// https://localhost:8001/api/v1/sign-in
router.post("/sign-up", async (req, res) => {
  try {
    //check if username is already exist?
    const { username, email, password, address } = req.body;
    const usernameAlreadyExist = await User.findOne({ username: username });
    const emailAlreadyExist = await User.findOne({ email: email });
    if (usernameAlreadyExist) {
      res.status(400).json({ message: "Username already exist" });
    }
    if (emailAlreadyExist) {
      res.status(400).json({ message: "email already exist" });
    }
    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password length should be greater than 6" });
    }
    const hashedPassword = await passwordHashing.generate(password);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "User created sucessfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Error" });
    console.log(error);
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(400).json({ message: "Invalid Credential" });
    }
    const passwordMatch = await passwordHashing.verify(
      password,
      existingUser.password
    );
    if (passwordMatch) {
      const authClaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      const token = jwt.sign({ authClaims }, "bookStore123", {
        expiresIn: "30d",
      });

      res
        .status(200)
        .json({ id: existingUser._id, role: existingUser.role, token: token });
    } else {
      res.status(400).json({ message: "Invalid Credential" });
    }
  } catch (error) {
    // console.log(passwordMatch);

    res.status(500).json({ message: "Internal Error" });
    console.log(error);
  }
});
router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
