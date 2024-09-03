const alive = async (res) => {
  const timestamp = Date.now();

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();
  try {
    return res.status(200).json({ message: "I AM ALIVE", Date: formattedDate });
  } catch (err) {
    console.error("I AM DEAD", formattedDate);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const verified = (req, res) => {
  return res.status(200).json({ message: "Token Valid" });
};

module.exports = {
  alive,
  verified,
};
