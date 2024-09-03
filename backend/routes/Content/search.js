const router = require("express").Router();
const userController = require("../../controller/Account/UserController");

//Get Data to Search
router.get("/", userController.user_index);

//Post Data to Search
router.post("/", userController.user_update);

module.exports = router;
