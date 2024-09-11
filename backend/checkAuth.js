const jwt = require("jsonwebtoken");
const InvalidToken = require("./models/InvalidToken");

const verifyToken = async (req, res, next) => {
  const KEY = process.env.KEY;
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const invalidToken = await InvalidToken.findOne({
    token: token,
  });
  if (invalidToken)
    return res
      .status(401)
      .json({ message: "Access denied. Token has Expired." });

  try {
    const decoded = jwt.verify(token, KEY);

    const currentTimestamp = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    if (decoded.exp !== undefined && decoded.exp < currentTimestamp) {
      return res
        .status(401)
        .json({ message: "Access denied. Token has expired." });
    }

    // req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Access denied. Invalid token." });
  }
};

module.exports = verifyToken;
