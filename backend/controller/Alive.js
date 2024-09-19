const AppError = require("../Utilities/appError");
const catchAsync = require("../Utilities/catchAsync");

const alive = catchAsync(async (res, nxet) => {
  const timestamp = Date.now();

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  return res.status(200).json({ message: "I AM ALIVE", Date: formattedDate });
});

const verified = catchAsync(async (req, res) => {
  return res.status(200).json({ message: "Token Valid" });
});

module.exports = {
  alive,
  verified,
};
