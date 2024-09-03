const Announcement = require("../../models/Content/Announcement");

const announcement_index = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.status(200).json(announcements);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const announcement_get = async (req, res) => {
  try {
    const announcement = await Announcement.find({
      _id: req.params.id,
    });
    if (!announcement)
      return res.status(404).json({ message: "Announcement not found" });
    res.status(200).json(announcement);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const announcement_user_get = async (req, res) => {
  try {
    const announcements = await Announcement.find({
      username: req.query.username,
    });
    if (!announcements)
      return res.status(404).json({ message: "Announcements not found" });
    res.status(200).json(announcements);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const announcement_post = async (req, res) => {
  const newAnnouncement = new Announcement(req.body);
  try {
    const savedAnnouncement = await newAnnouncement.save();
    res.status(200).json({
      message: "Announcement Successfully Created",
      savedAnnouncement,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const announcement_update = async (req, res) => {
  // if (req.body.userId === req.params.id || req.user.isAdmin) {
  try {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
  // } else {
  //   return res.status(403).json("Error Request");
  // }
};

const announcement_delete = async (req, res) => {
  //   if (req.body.userId === req.params.id || req.user.isAdmin) {
  try {
    console.log(req.params.id);
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json("Announcement Successfully Deleted");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
  // } else {
  // return res
  //   .status(403)
  //   .json({ message: "You can only delete your own announcement" });
  // }
};

module.exports = {
  announcement_index,
  announcement_get,
  announcement_user_get,
  announcement_post,
  announcement_update,
  announcement_delete,
};
