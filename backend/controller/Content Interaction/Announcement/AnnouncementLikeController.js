const AnnouncementLike = require("../../../models/Content Interaction/Announcement/AnnouncementLike");
const Announcement = require("../../../models/Content/Announcement");
const AnnouncementComment = require("../../../models/Content Interaction/Announcement/AnnouncementComment");
const AnnouncementReply = require("../../../models/Content Interaction/Announcement/AnnouncementReply");

const likeAnnouncement = async (req, res) => {
  const { userId, announcementId, announcementCommentId, announcementReplyId } =
    req.body;

  try {
    // Determine the likeable item and model based on request parameters
    let likeableId, likeableModel, existingLike;
    if (announcementId) {
      likeableId = announcementId;
      likeableModel = "Announcement";

      existingLike = await AnnouncementLike.findOne({
        userId: userId,
        likeable: likeableId,
      });
    } else if (announcementCommentId) {
      likeableId = announcementCommentId;
      likeableModel = "AnnouncementComment";

      existingLike = await AnnouncementComment.findOne({
        userId: userId,
        likeable: likeableId,
      });
    } else if (announcementReplyId) {
      likeableId = announcementReplyId;
      likeableModel = "AnnouncementReply";

      existingLike = await AnnouncementComment.findOne({
        userId: userId,
        likeable: likeableId,
      });
    } else {
      // Handle invalid request parameters
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    if (existingLike)
      return res.status(200).json({
        message: `${likeableModel} already liked`,
        existingLike,
      });

    const like = new AnnouncementLike({
      userId: userId,
      likeable: likeableId,
      likeableModel: likeableModel,
    });

    let updatedModel;
    await like.save();

    if (announcementId) {
      updatedModel = await Announcement.findByIdAndUpdate(
        likeableId,
        { $push: { likes: like._id } }, // Increment the likes field by 1
        { new: true }
      );
    } else if (announcementCommentId) {
      updatedModel = await AnnouncementComment.findByIdAndUpdate(
        likeableId,
        { $push: { likes: like._id } }, // Increment the likes field by 1
        { new: true }
      );
    } else if (announcementReplyId) {
      updatedModel = await AnnouncementReply.findByIdAndUpdate(
        likeableId,
        { $push: { likes: like._id } }, // Increment the likes field by 1
        { new: true }
      );
    }

    if (!updatedModel) {
      return res.status(404).json({ message: `${likeableModel} not found!` });
    }

    return res.status(200).json({
      message: "Announcement Liked Successfully",
      like,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getAnnouncementLikeCount = async (req, res) => {
  const { announcementId, announcementCommentId, announcementReplyId } =
    req.query;
  try {
    let announcementLike,
      likes = [];
    if (announcementId) {
      announcementLike = await Announcement.findById(announcementId);

      if (!announcementLike)
        return res.status(404).json({
          message: "Announcement does not have likes",
        });

      likes = await Promise.all(
        announcementLike.likes.map(async (id) => {
          const like = await AnnouncementLike.findById(id);
          return like;
        })
      );
    } else if (announcementCommentId) {
      announcementLike = await AnnouncementComment.findById(
        announcementCommentId
      );

      if (!announcementLike)
        return res.status(404).json({
          message: "Announcement Comment does not have likes",
        });

      likes = await Promise.all(
        announcementLike.likes.map(async (id) => {
          const like = await AnnouncementLike.findById(id);
          return like;
        })
      );
    } else if (announcementReplyId) {
      announcementLike = await AnnouncementReply.findById(announcementReplyId);

      if (!announcementLike)
        return res.status(404).json({
          message: "Announcement Reply not have likes",
        });

      likes = await Promise.all(
        announcementLike.likes.map(async (id) => {
          const like = await AnnouncementLike.findById(id);
          return like;
        })
      );
    } else
      return res.status(400).json({
        message: "Bad Request: Can't Identify Likeable",
      });

    if (!announcementLike)
      return res.status(404).json({
        message: "Count could not be found",
      });

    return res.status(200).json({
      likeCount: announcementLike.likes.length,
      likes: likes,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const unlikeAnnouncement = async (req, res) => {
  const { userId, announcementId, announcementCommentId, announcementReplyId } =
    req.query;

  let likeableId, likeableModel;
  // Determine the likeable item and model based on request parameters
  if (announcementId) {
    likeableId = announcementId;
    likeableModel = "Announcement";
  } else if (announcementCommentId) {
    likeableId = announcementCommentId;
    likeableModel = "AnnouncementComment";
  } else if (announcementReplyId) {
    likeableId = announcementReplyId;
    likeableModel = "AnnouncementReply";
  } else {
    // Handle invalid request parameters
    return res.status(400).json({ message: "Invalid request parameters" });
  }

  try {
    const existingLike = await AnnouncementLike.findOne({
      userId: userId,
      likeable: likeableId,
    });

    if (!existingLike) {
      return res.status(400).json({ message: "Announcement is not liked" });
    }

    await AnnouncementLike.findByIdAndDelete(existingLike._id);

    let updatedModel;

    if (announcementId) {
      updatedModel = await Announcement.findByIdAndUpdate(
        likeableId,
        { $pull: { likes: existingLike._id } },
        { new: true }
      );
    } else if (announcementCommentId) {
      updatedModel = await AnnouncementComment.findByIdAndUpdate(
        likeableId,
        { $pull: { likes: existingLike._id } },
        { new: true }
      );
    } else if (announcementReplyId) {
      updatedModel = await AnnouncementReply.findByIdAndUpdate(
        likeableId,
        { $pull: { likes: existingLike._id } },
        { new: true }
      );
    }

    if (!updatedModel) {
      return res.status(404).json({ message: `${likeableModel} not found!` });
    }

    return res.status(200).json({
      message: "Unliked Announcement successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  likeAnnouncement,
  getAnnouncementLikeCount,
  unlikeAnnouncement,
};
