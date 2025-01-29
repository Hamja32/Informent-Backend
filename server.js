const express = require("express");
// const passwordHash = require("password-hash");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/conn");

//routing
const user = require("./routes/user.route");
const book = require("./routes/book.route");
const fav = require("./routes/fav.route");
const cart = require("./routes/cart.route");
const order = require("./routes/order.route");

app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", fav);
app.use("/api/v1", cart);
app.use("/api/v1", order);

//database function

///////////////////////
app.get("/", (req, res) => {
  res.send("I am in backend");
});

app.listen(process.env.port, (req, res) => {
  console.log(`App started at ${process.env.port}`);
});
