const router = require("express").Router();
const multer = require("multer");
const uploadController = require("../../controller/Content/UploadController");

const upload = multer({ storage: multer.memoryStorage() });

// Post
router.post(
  "/picture/profile",
  upload.single("picture"),
  uploadController.post_profilepicture
);

module.exports = router;
