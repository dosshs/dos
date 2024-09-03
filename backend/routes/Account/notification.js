const router = require("express").Router();
const notificationController = require("../../controller/Account/NotificationController");

//Send Email Verification
router.get("/", notificationController.getNotification);
router.post("/", notificationController.sendNotification);
router.delete("/", notificationController.deleteNotification);

module.exports = router;
