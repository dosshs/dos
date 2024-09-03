const router = require("express").Router();
const mailController = require("../../controller/Account/MailController");

//Send Email Verification
router.put("/verification/:userId", mailController.sendAccountVerificationMail);
router.put("/signup/:userId", mailController.sendEmailVerificationMail);

module.exports = router;
