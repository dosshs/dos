const Article = require("../../models/Content/Article");
const AppError = require("../../Utilities/appError");
const catchAsync = require("../../Utilities/catchAsync");

const article_index = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  return res.status(200).json(articles);
});

const article_get = catchAsync(async (req, res, next) => {
  const article = await Article.find({
    _id: req.params.id,
  });
  if (!article) return next(new AppError("Article not found", 404));
  return res.status(200).json(article);
});

const article_user_get = catchAsync(async (req, res, next) => {
  const articles = await Article.find({
    userId: req.params.userId,
  });
  if (!articles) return next(new AppError("Article not found", 404));
  return res.status(200).json(articles);
});

const article_post = catchAsync(async (req, res, next) => {
  const newArticle = new Article(req.body);
  const savedArticle = await newArticle.save();
  return res
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
    return next(new AppError("Article not found", 404));
  }

  // Send the updated document in the response
  return res
    .status(200)
    .json({ message: "Article Updated Successfully", updatedArticle });
});

const article_delete = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  await Article.findByIdAndDelete(req.params.id);
  return res.status(200).json("Article Successfully Deleted");
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
