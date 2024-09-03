const User = require("../../models/User");
const InvalidToken = require("../../models/InvalidToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user_signup = async (req, res) => {
  const KEY = process.env.KEY;
  const { username, email, password } = req.body;
  try {
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

    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const payload = { user: JSON.stringify(newUser), exp: expiration };
    const token = jwt.sign(payload, KEY);

    res.status(200).json({
      message: "Signed Up Successfully",
      id: newUser._id,
      token: token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const user_login = async (req, res) => {
  const KEY = process.env.KEY;
  const { emailOrUsername, password } = req.body;
  try {
    // Check if the user exists by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Username or Email" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.dateLastLoggedIn = Date.now();

    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const payload = { user: JSON.stringify(user), exp: expiration };
    const token = jwt.sign(payload, KEY);

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const InvalidateToken = async (req, res) => {
  const { token } = req.query;

  const invalidToken = new InvalidToken({
    token: token,
  });

  try {
    await invalidToken.save();
    res.status(200).json({ message: "Logged Out Successfully", invalidToken });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const user_find = async (req, res) => {
  //Email or Username
  const { account } = req.query;
  try {
    // Check if the user exists by email or username
    const user = await User.findOne({
      $or: [{ email: account }, { username: account }],
    });

    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }

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
    res.status(200).json({ message: "User Fetched", other });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const user_recover = async (req, res) => {
  const KEY = process.env.KEY;
  const { userId } = req.query;
  const { password } = req.body;

  if (!password)
    return res.status(418).json({ message: "No Password Provided" });

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not Found." });

    const expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
    const payload = { user: JSON.stringify(user), exp: expiration };
    const token = jwt.sign(payload, KEY);

    return res
      .status(200)
      .json({ message: "Account Successfully Recovered", token: token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  user_find,
  user_recover,
  user_signup,
  user_login,
  InvalidateToken,
};
