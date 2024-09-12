const Post = require("../../../models/Content/Post");
const PostCategory = require("../../../models/Content/PostCategory");

const createCategory = async (req, res) => {
  const { name, description, adminOnly } = req.body;
  let category;

  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await PostCategory.find();

    return res.status(200).json({
      categories,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const updateCategory = async (req, res) => {
  const { name, categoryId, newName, description } = req.body;

  let query = {},
    update = {};
  name ? (query.name = name) : (query._id = categoryId);
  if (newName) update.name = newName;
  if (description) update.description = description;
  try {
    const updatedCategory = await PostCategory.findOneAndUpdate(
      query,
      { $set: update },
      { new: true }
    );
    return res.status(200).json({
      query,
      updatedCategory,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteCategory = async (req, res) => {
  const { name, categoryId } = req.query;

  let category;
  try {
    if (name) category = await PostCategory.findOneAndDelete({ name: name });
    else if (categoryId)
      category = await PostCategory.findByIdAndDelete(categoryId);
    else
      return res.status(400).json({
        message: "No category identifier",
      });

    if (!category)
      return res.status(200).json({
        message: "Category not found",
      });

    return res.status(200).json({
      message: "Category deleted successfully",
      category,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
