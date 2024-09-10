const router = require("express").Router();
const announcementController = require("../../controller/Content/AnnouncementController");
const likeController = require("../../controller/Content Interaction/Announcement/AnnouncementLikeController");
const commentController = require("../../controller/Content Interaction/Announcement/AnnouncementCommentController");

//Get Announcements
router.get("/", announcementController.announcement_index);

//Get Announcement
router.get("/:id", announcementController.announcement_get);

//Get User Announcements
router.get("/user/a", announcementController.announcement_user_get);

//Post Announcement
router.post("/", announcementController.announcement_post);

//Update Announcement
router.put("/:id", announcementController.announcement_update);

//Delete Announcement
router.delete("/:id", announcementController.announcement_delete);

//Like=================================================
//Like Announcement
router.post("/like", likeController.likeAnnouncement);

//Unlike Announcement
router.delete("/like/:likeId", likeController.unlikeAnnouncement);

//Get Announcement Likes number
router.get(
  "/like/count/:announcementId",
  likeController.getAnnouncementLikeCount
);

//Comment==============================================
//Comment on Announcement
router.post("/comment", commentController.commentAnnouncement);

//Delete Comment
router.delete("/comment/:commentId", commentController.deleteComment);

//Get Announcement Comment count
router.get("/comment/count", commentController.getAnnouncementCommentCount);

//Get Announcement Comment
router.get("/comment/c", commentController.getAnnouncementComments);

module.exports = router;
