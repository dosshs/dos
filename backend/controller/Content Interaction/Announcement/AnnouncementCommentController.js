const Announcement = require("../../../models/Content/Announcement");
const AnnouncementComment = require("../../../models/Content Interaction/Announcement/AnnouncementComment");
const AnnouncementReply = require("../../../models/Content Interaction/Announcement/AnnouncementReply");

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
      username,
      fullname,
      announcementId,
      content,
    });
  } else if (announcementCommentId) {
    comment = new AnnouncementReply({
      profilePicture,
      userId,
      username,
      fullname,
      announcementCommentId,
      content,
    });
  } else {
    return res.status(204).json({ message: "Comment Unidentified" });
  }

  try {
    await comment.save();

    if (announcementId) {
      updatedModel = await Announcement.findByIdAndUpdate(
        announcementId,
        { $push: { comments: comment._id } },
        { new: true }
      );
    } else if (announcementCommentId) {
      updatedModel = await AnnouncementComment.findByIdAndUpdate(
        announcementCommentId,
        { $push: { comments: comment._id } },
        { new: true }
      );
    }

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

  if (!announcementId && !announcementCommentId)
    return res.status(400).json({
      message:
        "Bad Request: Could not identify if Announcement or Announcement Comment",
    });

  try {
    let comments = [];
    if (announcementId) {
      const announcement = await Announcement.findById(announcementId);
      if (!announcementComment)
        return res.status(404).json({
          message: "Announcement does not have comments",
        });

      comments = await Promise.all(
        announcement.comments.map(async (id) => {
          const comment = await AnnouncementComment.findById(id);
          return comment;
        })
      );
    } else if (announcementId) {
      const announcementComment = await AnnouncementComment.findById(
        announcementCommentId
      );
      if (!announcementComment)
        return res.status(404).json({
          message: "Announcement does not have comments",
        });

      comments = await Promise.all(
        announcementComment.comments.map(async (id) => {
          const comment = await AnnouncementComment.findById(id);
          return comment;
        })
      );
    }

    if (comments.length > 0) {
      return res.status(200).json({
        comments,
      });
    } else {
      return res.status(404).json({
        message:
          "Announcement does not have comments or Announcement does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getAnnouncementCommentCount = async (req, res) => {
  const { announcementId, announcementCommentId } = req.query;

  if (!announcementId && !announcementCommentId)
    return res.status(400).json({
      message:
        "Bad Request: Could not identify if Announcement or Announcement Comment",
    });

  try {
    let commentCount;

    if (announcementId) {
      const announcement = await Announcement.findById(announcementId);
      commentCount = announcement.comments.length;
    } else if (announcementCommentId) {
      const announcementComment = await AnnouncementComment.findById(
        announcementCommentId
      );
      commentCount = announcementComment.comments.length;
    }

    return res.status(200).json({
      commentCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const deleteComment = async (req, res) => {
  const { announcementCommentId, announcementReplyId } = req.query;

  try {
    let comment;
    if (announcementCommentId) {
      comment = await AnnouncementComment.findById(announcementCommentId);
      if (!comment)
        return res.status(404).json({
          message: "Announcement Comment not found",
        });

      await Announcement.findByIdAndUpdate(
        comment.announcementId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    } else if (announcementReplyId) {
      comment = await AnnouncementReply.findById(announcementReplyId);
      if (!comment)
        return res.status(404).json({
          message: "Announcement Comment not found",
        });

      await AnnouncementComment.findByIdAndUpdate(
        comment.announcementCommentId,
        { $pull: { comments: comment._id } },
        { new: true }
      );
    } else {
      return res.status(400).json({
        message:
          "Bad Request: Could not identify if Announcement Comment or Announcement Reply",
      });
    }

    await comment.deleteOne();

    if (comment) {
      return res.status(200).json({
        message: "Comment deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Comment does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  commentAnnouncement,
  getAnnouncementComments,
  getAnnouncementCommentCount,
  deleteComment,
};
