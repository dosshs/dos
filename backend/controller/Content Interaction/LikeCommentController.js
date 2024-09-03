const CommentLike = require("../../models/Content Interaction/CommentLike");

const commentLike_post = async (req, res) => {
  const { commentId, userId, username } = req.body;

  try {
    const liked = await CommentLike.findOne({
      commentId: commentId,
      userId: userId,
      username: username,
    });

    if (liked)
      return res.status(302).json({
        message: "Comment already liked",
        liked,
      });

    const like = new CommentLike({
      commentId,
      userId,
      username,
    });

    await like.save();
    return res.status(200).json({
      message: "Comment Liked Successfully",
      like,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const commentLikeCount_get = async (req, res) => {
  const { commentId } = req.query;

  try {
    const likeCount = await CommentLike.find({ commentId });

    return res.status(200).json({
      likeCount: likeCount.length,
      likes: likeCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const commentLike_delete = async (req, res) => {
  const { likeId } = req.query;
  try {
    await CommentLike.findByIdAndDelete(likeId);

    return res.status(200).json({
      message: "Unliked Comment successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

module.exports = {
  commentLike_post,
  commentLikeCount_get,
  commentLike_delete,
};
