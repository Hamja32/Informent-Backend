const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ message: "Authentication token required" });
  }

  jwt.verify(token, "bookStore123", (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token expired , please sign in again" });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
