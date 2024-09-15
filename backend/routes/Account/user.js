const router = require("express").Router();
const userController = require("../../controller/Account/UserController");
const schoolDetailController = require("../../controller/Account/SchoolDetailController");

// //Get User
// router.get("/", userController.user_index);

// User Profile
router.get("/", userController.user_get);

//Update User
router.put("/:userId", userController.user_update);

//Delete User
router.delete("/:id", userController.user_delete);

//================School Detail Controller =================
// //Create Detail
router.post("/detail/", schoolDetailController.createDetail);

// Get Detail
router.get("/detail/", schoolDetailController.getDetail);

//Update Detail
router.put("/detail/u", schoolDetailController.updateDetail);

//Delete Detail
router.delete("/detail/d", schoolDetailController.deleteDetail);

module.exports = router;
