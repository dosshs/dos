const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const verification = catchAsync(async (req, res) => {
  return res.status(200).json({ message: "Token Valid" });
});

module.exports = {
  verification,
};
