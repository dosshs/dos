const AnnouncementLike = require("../../models/Content Interaction/AnnouncementLike");

const likeAnnouncement = async (req, res) => {
  const { announcementId, userId, username } = req.body;

  const liked = await AnnouncementLike.findOne({
    announcementId: announcementId,
    userId: userId,
    username: username,
  });

  if (liked)
    return res.status(302).json({
      message: "Announcement already liked",
      liked,
    });

  const like = new AnnouncementLike({
    announcementId,
    userId,
    username,
  });
  try {
    await like.save();

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
  const { announcementId } = req.params;
  try {
    const likeCount = await AnnouncementLike.find({ announcementId });

    return res.status(200).json({
      likeCount: likeCount.length,
      likes: likeCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const unlikeAnnouncement = async (req, res) => {
  const { likeId } = req.params;
  try {
    await AnnouncementLike.findByIdAndDelete(likeId);

    return res.status(200).json({
      message: "Unliked Post successfully",
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
