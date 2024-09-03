const AnnouncementComment = require("../../models/Content Interaction/AnnouncementComment");

const commentAnnouncement = async (req, res) => {
  const {
    profilePicture,
    userId,
    fullname,
    username,
    announcementId,
    announcementCommentId,
    content,
  } = req.body;
  let comment;

  if (announcementId) {
    comment = new AnnouncementComment({
      profilePicture,
      userId,
      fullname,
      username,
      announcementId,
      content,
    });
  } else if (announcementCommentId) {
    comment = new AnnouncementComment({
      profilePicture,
      userId,
      fullname,
      username,
      announcementCommentId,
      content,
    });
  } else {
    return res.status(204).json({ message: "Comment Unidentified", err });
  }

  try {
    await comment.save();

    return res.status(200).json({
      message: "Announcement commented Successfully",
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getAnnouncementComments = async (req, res) => {
  const { announcementId, announcementCommentId } = req.query;

  let query = {};

  if (announcementId) query = { announcementId };
  else if (announcementCommentId)
    query = { announcementCommentId: announcementCommentId };
  else {
    return res.status(400).json({
      message: "No Announcement Id or Comment Id Provided",
    });
  }
  try {
    const comments = await AnnouncementComment.find(query);

    if (comments) {
      return res.status(200).json({
        comments,
      });
    } else {
      return res.status(404).json({
        message: "Announcement does not have comments or Post does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getAnnouncementCommentCount = async (req, res) => {
  if (req.query.announcementId)
    query = { announcementId: req.query.announcementId };
  else if (req.query.announcementCommentId)
    query = { announcementCommentId: req.query.announcementCommentId };
  else {
    return res.status(400).json({
      message: "No Post Id or Comment Id Provided",
    });
  }
  try {
    const commentCount = await AnnouncementComment.countDocuments(query);

    return res.status(200).json({
      commentCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await AnnouncementComment.findByIdAndDelete(
      commentId
    );

    if (deletedComment) {
      return res.status(200).json({
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Comment does not exist",
      });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  commentAnnouncement,
  getAnnouncementComments,
  getAnnouncementCommentCount,
  deleteComment,
};
