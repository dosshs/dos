const Feedback = require("../../models/Content/Feedback");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const feedback_index = catchAsync(async (req, res, next) => {
  const { feedbackId } = req.query;
  let query = {};

  if (feedbackId && feedbackId !== "null") {
    query._id = { $lt: feedbackId };
  }
  const feedbacks = await Feedback.find(query)
    .sort({ _id: -1 })
    .limit(30)
    .lean();

  return res.status(200).json(feedbacks);
});

const feedback_user_get = catchAsync(async (req, res, next) => {
  const feedbacks = await Feedback.find({
    username: req.query.username,
  });
  if (!feedbacks)
    return res.status(404).json({ message: "Feedbacks not found" });
  res.status(200).json(feedbacks);
});

const feedback_post = catchAsync(async (req, res, next) => {
  const newFeedback = new Feedback(req.body);

  const savedFeedback = await newFeedback.save();
  res
    .status(200)
    .json({ message: "Feedback Successfully Created", savedFeedback });
});

const feedback_delete = catchAsync(async (req, res, next) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).json("Feedback Successfully Deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
});

module.exports = {
  feedback_index,
  feedback_user_get,
  feedback_post,
  feedback_delete,
};
