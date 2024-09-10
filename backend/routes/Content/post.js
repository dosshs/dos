const router = require("express").Router();
const postController = require("../../controller/Content/PostController");
const likeController = require("../../controller/Content Interaction/Post/PostLikeController");
const commentController = require("../../controller/Content Interaction/Post/PostCommentController");
const reportPostController = require("../../controller/Content Interaction/ReportPostController");

//Post=============================================
//Get Posts
router.get("/", postController.post_index);

//Get Post
router.get("/:postId", postController.post_get);

//Get User Posts
router.get("/user/p", postController.post_user_get);

//Post Post
router.post("/", postController.post_post);

//Update Post
router.put("/:id", postController.post_update);

//Delete Post
router.delete("/:id", postController.post_delete);

//Like=================================================
//Like Post
router.post("/like", likeController.likePost);

//Unlike Post
router.delete("/like/unlike", likeController.unlikePost);

//Get Post Likes number
router.get("/like/count/:postId", likeController.getPostLikeCount);

//Comment==============================================
//Comment on Post
router.post("/comment", commentController.commentPost);

//Delete Comment
router.delete("/comment/:commentId", commentController.deleteComment);

//Get Post Comment count
router.get("/comment/count", commentController.getPostCommentCount);

//Get Post Comment
router.get("/comment/c", commentController.getPostComments);

//Report===============================================
//Post a Report
router.post("/report", reportPostController.postReportPost);

//Get all Reports
router.get("/report/all", reportPostController.getReports);

//Get a Report
router.get("/report/:reportId", reportPostController.getReport);

//Delete a Report
router.delete("/report/:reportId", reportPostController.deleteReport);

module.exports = router;
