const router = require("express").Router();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const KEY = process.env.KEY;
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  } else {
    try {
      await jwt.verify(token, KEY);
      next();
      // req.user = decoded;
    } catch (err) {
      if (err.name === "TokenExpiredError")
        return res
          .status(401)
          .json({ message: "Access denied. Token Expired." });
      else
        return res
          .status(403)
          .json({ message: "Access denied. Invalid Token." });
    }
  }
};

module.exports = verifyToken;
