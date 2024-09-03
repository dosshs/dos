const PostComment = require("../../models/Content Interaction/PostComment");

const commentPost = async (req, res) => {
  const { profilePicture, userId, username, postId, content } = req.body;
  const comment = new PostComment({
    profilePicture,
    userId,
    username,
    postId,
    content,
  });
  try {
    await comment.save();

    return res.status(200).json({
      message: "Post commented Successfully",
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostComments = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await PostComment.find({ postId });

    if (comments) {
      return res.status(200).json({
        comments,
      });
    } else {
      return res.status(404).json({
        message: "Post does not have comments or Post does not exist",
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", err });
  }
};

const getPostCommentCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const commentCount = await PostComment.countDocuments({ postId });

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
    const deletedComment = await PostComment.findByIdAndDelete(commentId);

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
  commentPost,
  getPostComments,
  getPostCommentCount,
  deleteComment,
};
