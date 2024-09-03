const router = require("express").Router();
const articleController = require("../../controller/Content/ArticleController");

//Get Articles
router.get("/", articleController.article_index);

//Get Article
router.get("/:id", articleController.article_get);

//Get User Articles
router.get("/user/:userId", articleController.article_user_get);

//Post Article
router.post("/", articleController.article_post);

//Update Article
router.put("/:id", articleController.article_update);

//Delete Article
router.delete("/:id", articleController.article_delete);

module.exports = router;
