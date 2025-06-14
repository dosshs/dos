const Announcement = require("../../../models/Content/Announcement");
const AnnouncementComment = require("../../../models/Content Interaction/Announcement/AnnouncementComment");
const AnnouncementReply = require("../../../models/Content Interaction/Announcement/AnnouncementReply");
const AppError = require("../../../Utilities/appError");
const catchAsync = require("../../../Utilities/catchAsync");

const commentAnnouncement = catchAsync(async (req, res, next) => {
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
    return next(new AppError("Comment Unidentified", 204));
  }

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
});

const getAnnouncementComments = catchAsync(async (req, res, next) => {
  const { announcementId, announcementCommentId } = req.query;

  if (!announcementId && !announcementCommentId)
    return next(
      new AppError(
        "Bad Request: Could not identify if Announcement or Announcement Comment",
        400
      )
    );

  let comments = [];
  if (announcementId) {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement)
      return res.status(200).json({
        message: "Announcement does not have comments",
      });

    comments = await Promise.all(
      announcement.comments.map(async (id) => {
        const comment = await AnnouncementComment.findById(id);
        return comment;
      })
    );
  } else if (announcementCommentId) {
    const announcementComment = await AnnouncementComment.findById(
      announcementCommentId
    );

    if (!announcementComment)
      return res.status(200).json({
        message: "Comment does not have replies",
      });

    comments = await Promise.all(
      announcementComment.comments.map(async (id) => {
        const comment = await AnnouncementReply.findById(id);
        return comment;
      })
    );
  }

  return res.status(200).json({
    comments,
  });
});

const getAnnouncementCommentCount = catchAsync(async (req, res, next) => {
  const { announcementId, announcementCommentId } = req.query;

  if (!announcementId && !announcementCommentId)
    return next(
      new AppError(
        "Bad Request: Could not identify if Announcement or Announcement Comment",
        400
      )
    );

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
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { announcementCommentId, announcementReplyId } = req.query;

  let comment;
  if (announcementCommentId) {
    comment = await AnnouncementComment.findById(announcementCommentId);
    if (!comment)
      return next(new AppError("Announcement comment not found", 404));

    await Announcement.findByIdAndUpdate(
      comment.announcementId,
      { $pull: { comments: comment._id } },
      { new: true }
    );
  } else if (announcementReplyId) {
    comment = await AnnouncementReply.findById(announcementReplyId);
    if (!comment)
      return next(new AppError("Announcement comment not found", 404));

    await AnnouncementComment.findByIdAndUpdate(
      comment.announcementCommentId,
      { $pull: { comments: comment._id } },
      { new: true }
    );
  } else {
    return next(
      new AppError(
        "Bad Request: Could not identify if Announcement or Announcement Comment",
        400
      )
    );
  }

  await comment.deleteOne();

  return res.status(200).json({
    message: "Comment deleted successfully",
  });
});

module.exports = {
  commentAnnouncement,
  getAnnouncementComments,
  getAnnouncementCommentCount,
  deleteComment,
};
