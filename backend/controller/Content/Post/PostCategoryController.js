const Post = require("../../../models/Content/Post");
const PostCategory = require("../../../models/Content/PostCategory");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const createCategory = catchAsync(async (req, res, next) => {
  const { name, description, adminOnly } = req.body;
  let category;

  const categoryFound = await PostCategory.find({
    name: name,
    description: description,
  });

  if (categoryFound.length > 0)
    return res.status(400).json({
      message: `Category "${name}" is already registered`,
      categoryFound,
    });

  category = new PostCategory({
    name,
    description,
  });

  if (adminOnly) category.adminOnly = adminOnly;

  await category.save();

  return res.status(200).json({
    message: "Category Added Successfully",
    category,
  });
});

const getCategories = catchAsync(async (req, res, next) => {
  const categories = await PostCategory.find();

  return res.status(200).json({
    categories,
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId, newName, description } = req.body;

  let query = {},
    update = {};
  name ? (query.name = name) : (query._id = categoryId);
  if (newName) update.name = newName;
  if (description) update.description = description;

  const updatedCategory = await PostCategory.findOneAndUpdate(
    query,
    { $set: update },
    { new: true }
  );
  
  return res.status(200).json({
    query,
    updatedCategory,
  });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const { name, categoryId } = req.query;

  let category;

  if (name) category = await PostCategory.findOneAndDelete({ name: name });
  else if (categoryId)
    category = await PostCategory.findByIdAndDelete(categoryId);
  else return next(new AppError("No category identifier", 400));

  if (!category) return next(new AppError("Category not found", 404));

  return res.status(200).json({
    message: "Category deleted successfully",
    category,
  });
});

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
