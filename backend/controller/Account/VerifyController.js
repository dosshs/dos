const User = require("../../models/User/User");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const email_verification = catchAsync(async (req, res, next) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  if (user.emailValid === true)
    return res.status(200).json({ message: "Account Email already verified" });

  user.emailValid = true;
  user.verificationToken = "";
  await user.save();

  res.status(200).json({ message: "Email Successfully Verified" });
});

const account_verification = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).send({ message: "Invalid verification token" });
  }

  if (Date.now() > user.verificationTokenExpiry) {
    return res
      .status(400)
      .send({ message: "Token Expired. Please request for a new one." });
  }

  if (user.accountVerification === true)
    return res.status(200).send({ message: "Account is already Verified" });

  user.accountVerification = true;
  user.verificationToken = "";
  user.verificationTokenExpiry = null;
  await user.save();

  setTimeout(async () => {
    user.accountVerification = false;
    await user.save();
  }, 5 * 60 * 1000);

  res.status(200).json({ message: "Account Successfully Verified" });
});
// Email successfully verified
// return res.redirect("/verification-success"); // Redirect to a success page

module.exports = {
  email_verification,
  account_verification,
};
