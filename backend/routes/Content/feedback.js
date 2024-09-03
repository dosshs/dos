const router = require("express").Router();
const FeedbackController = require("../../controller/Content/FeedbackController");

//Get Feedback
router.get("/", FeedbackController.feedback_index);

//Get User Feedbacks
router.get("/user/f", FeedbackController.feedback_user_get);

//Post Feedback
router.post("/", FeedbackController.feedback_post);

//Delete Feedback
router.delete("/:id", FeedbackController.feedback_delete);

module.exports = router;
