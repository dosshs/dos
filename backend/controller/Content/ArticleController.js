const Article = require("../../models/Content/Article");

const article_index = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const article_get = async (req, res) => {
  try {
    const article = await Article.find({
      _id: req.params.id,
    });
    if (!article) return res.status(404).json({ message: "Article not found" });
    res.status(200).json(article);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const article_user_get = async (req, res) => {
  try {
    const articles = await Article.find({
      userId: req.params.userId,
    });
    if (!articles)
      return res.status(404).json({ message: "Articles not found" });
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const article_post = async (req, res) => {
  const newArticle = new Article(req.body);
  try {
    const savedArticle = await newArticle.save();
    res
      .status(200)
      .json({ message: "Article Successfully Created", savedArticle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const article_update = async (req, res) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id, // Update based on the document's ID
      { $set: req.body }, // New data to set
      { new: true } // Return the updated document
    );

    // Check if the document was found and updated
    if (!updatedArticle) {
      return res.status(404).json("Article not found");
    }

    // Send the updated document in the response
    res
      .status(200)
      .json({ message: "Article Updated Successfully", updatedArticle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
  // } else {
  //   return res.status(403).json("Error Request");
  // }
};

const article_delete = async (req, res) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json("Article Successfully Deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
  // } else {
  //   return res.status(403).json("You can only delete your own article");
  // }
};

module.exports = {
  article_index,
  article_get,
  article_user_get,
  article_post,
  article_update,
  article_delete,
};
