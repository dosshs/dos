const router = require("express").Router();
const userController = require("../../controller/Account/UserController");

// //Get User
router.get("/", userController.user_index);

// User Profile
// router.get("/", userController.user_get);

//Update User
router.put("/:userId", userController.user_update);

//Delete User
router.delete("/:id", userController.user_delete);

module.exports = router;
