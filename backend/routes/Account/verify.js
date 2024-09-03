const router = require("express").Router();
const verifyController = require("../../controller/Account/VerifyController");

//Verify User
router.get("/email", verifyController.email_verification);
router.get("/account", verifyController.account_verification);

module.exports = router;
