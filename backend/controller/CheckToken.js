const verification = (req, res) => {
  return res.status(200).json({ message: "Token Valid" });
};

module.exports = {
  verification,
};
