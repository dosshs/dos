const router = require("express").Router();
const mailController = require("../../controller/Account/MailController");

//Send Email Verification
router.put("/verification/", mailController.sendAccountVerificationMail);
router.put("/signup/", mailController.sendEmailVerificationMail);

module.exports = router;
