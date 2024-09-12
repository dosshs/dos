const User = require("../../models/User/User");
const Post = require("../models/Post");
const Announcement = require("../models/Announcement");

const search_get = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

const search_post = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("user not found");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).json("Wrong password");

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
};

module.exports = {
  search_get,
  search_post,
};
