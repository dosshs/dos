const router = require("express").Router();
const jwt = require("../controller/CheckToken");

router.get("/token", jwt.verification);

module.exports = router;
