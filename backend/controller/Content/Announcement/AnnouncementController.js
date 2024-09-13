const Announcement = require("../../../models/Content/Announcement");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const announcement_index = catchAsync(async (req, res) => {
  const announcements = await Announcement.find();
  res.status(200).json(announcements);
});

const announcement_get = catchAsync(async (req, res, next) => {
  const announcement = await Announcement.find({
    _id: req.params.id,
  });
  if (!announcement)
    return res.status(404).json({ message: "Announcement not found" });
  res.status(200).json(announcement);
});

const announcement_user_get = catchAsync(async (req, res, next) => {
  const announcements = await Announcement.find({
    username: req.query.username,
  });
  if (!announcements)
    return res.status(404).json({ message: "Announcements not found" });
  res.status(200).json(announcements);
});

const announcement_post = catchAsync(async (req, res, next) => {
  const newAnnouncement = new Announcement(req.body);

  const savedAnnouncement = await newAnnouncement.save();
  res.status(200).json({
    message: "Announcement Successfully Created",
    savedAnnouncement,
  });
});

const announcement_update = catchAsync(async (req, res, next) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {

  const updatedAnnouncement = await Announcement.findByIdAndUpdate(
    req.params.id,
    { $set: req.body }, // New data to set
    { new: true }
  );

  // Check if the document was found and updated
  if (!updatedAnnouncement) {
    return res.status(404).json({ message: "Announcement not found" });
  }

  // Send the updated document in the response
  res
    .status(200)
    .json({ message: "Article Updated Successfully", updatedArticle });

  // } else {
  //   return res.status(403).json("Error Request");
  // }
});

const announcement_delete = catchAsync(async (req, res, next) => {
  //   if (req.body.userId === req.params.id || req.user.isAdmin) {

  await Announcement.findByIdAndDelete(req.params.id);
  res.status(200).json("Announcement Successfully Deleted");

  // } else {
  // return res
  //   .status(403)
  //   .json({ message: "You can only delete your own announcement" });
  // }
});

module.exports = {
  announcement_index,
  announcement_get,
  announcement_user_get,
  announcement_post,
  announcement_update,
  announcement_delete,
};
