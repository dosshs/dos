const User = require("../../models/User/User");
const InvalidToken = require("../../models/InvalidToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const user_signup = catchAsync(async (req, res, next) => {
  const KEY = process.env.KEY;
  const { username, email, password } = req.body;
  //Encrypt Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //Create User
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });
  //Save User and Respond
  await newUser.save();

  const expiration = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const payload = { user: JSON.stringify(newUser), exp: expiration };
  const token = jwt.sign(payload, KEY);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_TEMP_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("tempToken", token, cookieOptions);

  return res.status(200).json({
    message: "Signed Up Successfully",
    id: newUser._id,
    token: token,
  });
});

const user_login = catchAsync(async (req, res, next) => {
  const KEY = process.env.KEY;
  const { emailOrUsername, password } = req.body;
  // Check if the user exists by email or username
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });

  if (!user) {
    return next(new AppError("Invalid Username or Email", 404));
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return next(new AppError("Invalid password", 401));
  }

  user.dateLastLoggedIn = Date.now();

  const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const payload = { user: JSON.stringify(user), exp: expiration };
  const token = jwt.sign(payload, KEY);

  return res.status(200).json({ message: "Login successful", token });
});

const InvalidateToken = catchAsync(async (req, res, next) => {
  const { token } = req.query;

  const invalidToken = new InvalidToken({
    token: token,
  });

  await invalidToken.save();
  return res
    .status(200)
    .json({ message: "Logged Out Successfully", invalidToken });
});

const user_find = catchAsync(async (req, res, next) => {
  //Email or Username
  const { account } = req.query;
  // Check if the user exists by email or username
  const user = await User.findOne({
    $or: [{ email: account }, { username: account }],
  });

  if (!user) return next(new AppError("User not found", 404));

  const {
    emailValid,
    section,
    friends,
    accountVerification,
    dateAccountCreated,
    verificationToken,
    verificationTokenExpiry,
    password,
    isAdmin,
    __v,
    ...other
  } = user._doc;
  return res.status(200).json({ message: "User Fetched", other });
});

const user_recover = catchAsync(async (req, res, next) => {
  const KEY = process.env.KEY;
  const { userId } = req.query;
  const { password } = req.body;

  if (!password) return next(new AppError("No Password Provided", 418));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword },
    { new: true }
  );

  if (!user) return next(new AppError("User not found", 404));

  const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const payload = { user: JSON.stringify(user), exp: expiration };
  const token = jwt.sign(payload, KEY);
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_TEMP_COOKIE_EXPIRES_IN * 30 * 24 * 60 * 60 * 1000
    ), // 30 days
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);
  res.cookie("userId", user._id, cookieOptions);

  return res.status(200).json({ message: "Account Successfully Recovered" });
});

module.exports = {
  user_find,
  user_recover,
  user_signup,
  user_login,
  InvalidateToken,
};
