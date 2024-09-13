const Article = require("../../models/Content/Article");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const article_index = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  res.status(200).json(articles);
});

const article_get = catchAsync(async (req, res, next) => {
  const article = await Article.find({
    _id: req.params.id,
  });
  if (!article) return res.status(404).json({ message: "Article not found" });
  res.status(200).json(article);
});

const article_user_get = catchAsync(async (req, res, next) => {
  const articles = await Article.find({
    userId: req.params.userId,
  });
  if (!articles) return res.status(404).json({ message: "Articles not found" });
  res.status(200).json(articles);
});

const article_post = catchAsync(async (req, res, next) => {
  const newArticle = new Article(req.body);
  const savedArticle = await newArticle.save();
  res
    .status(200)
    .json({ message: "Article Successfully Created", savedArticle });
});

const article_update = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {

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
  // } else {
  //   return res.status(403).json("Error Request");
  // }
});

const article_delete = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  await Article.findByIdAndDelete(req.params.id);
  res.status(200).json("Article Successfully Deleted");
  // } else {
  //   return res.status(403).json("You can only delete your own article");
  // }
});

module.exports = {
  article_index,
  article_get,
  article_user_get,
  article_post,
  article_update,
  article_delete,
};
