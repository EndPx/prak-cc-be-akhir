require("dotenv").config();

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.TOKEN_SECRET_KEY;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader)
  if (!authHeader) return res.status(401).json({ status: "error", message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ status: "error", message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Token verified successfully:", decoded);
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    res.status(403).json({ status: "error", message: "Invalid token" });
  }
};

module.exports = verifyToken;
