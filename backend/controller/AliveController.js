const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const alive = catchAsync(async (req, res, next) => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString();

  res.status(200).json({ message: "I AM ALIVE", Date: formattedDate });
});

module.exports = {
  alive,
};
