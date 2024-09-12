const router = require("express").Router();
const announcementController = require("../../controller/Content/Announcement/AnnouncementController");
const likeController = require("../../controller/Content Interaction/Announcement/AnnouncementLikeController");
const commentController = require("../../controller/Content Interaction/Announcement/AnnouncementCommentController");
const AnnouncementCategory = require("../../controller/Content/Announcement/AnnouncementCategoryController");

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
router.delete("/like/unlike", likeController.unlikeAnnouncement);

//Get Announcement Likes number
router.get("/like/count", likeController.getAnnouncementLikeCount);

//Comment==============================================
//Comment on Announcement
router.post("/comment", commentController.commentAnnouncement);

//Delete Comment
router.delete("/comment/:commentId", commentController.deleteComment);

//Get Announcement Comment count
router.get("/comment/count", commentController.getAnnouncementCommentCount);

//Get Announcement Comment
router.get("/comment/c", commentController.getAnnouncementComments);

//Category===============================================
router.post("/category", AnnouncementCategory.createCategory);

//Get all Reports
router.get("/category/g", AnnouncementCategory.getCategories);

//Get a Report
router.put("/category/u", AnnouncementCategory.updateCategory);

//Delete a Report
router.delete("/category/d", AnnouncementCategory.deleteCategory);

module.exports = router;
