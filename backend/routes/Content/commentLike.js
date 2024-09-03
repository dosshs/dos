const router = require("express").Router();
const LikeCommentController = require("../../controller/Content Interaction/LikeCommentController");

//Like Comment
router.post("/", LikeCommentController.commentLike_post);

//Get Comment Likes
router.get("/", LikeCommentController.commentLikeCount_get);

//Unlike Comment
router.delete("/", LikeCommentController.commentLike_delete);

module.exports = router;
