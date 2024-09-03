const router = require("express").Router();
const authController = require("../../controller/Account/AuthController");

//REGISTER
router.post("/signup", authController.user_signup);

// LOGIN
router.post("/login", authController.user_login);

// LOGIN
router.post("/logout", authController.InvalidateToken);

//Forgot Password
router.get("/find/", authController.user_find);

//Recover Password
router.put("/recover/", authController.user_recover);

module.exports = router;
