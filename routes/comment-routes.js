const express = require("express");
const router = express.Router();

const commentDao = require("../modules/comment_dao.js");

router.post("/postcomment", async function (req, res) {

    if(req.session.user){
        const context = {
            articleId : req.body.articleId,
            username: req.session.user.username,
            comment : req.body.commentContent
        }
        // console.log(context);
        const insertComment = await commentDao.createComment(context);

        if(insertComment) {
            res.redirect("/readArticle?articleId=" + context.articleId);
        } else {
            res.redirect("/postcomment?message=Error posting comment.");
        }
    }else{
        res.redirect("/login?message=Please log in to post a comment.");
    }


});

router.get("/postcomment", function (req, res) {
    if(req.session.user){
        res.render("comment_template");
    }else{
        res.redirect("/login?message=Please log in to post a comment.");
    }
});

router.post("/deleteComment", async function (req, res) {

    if(req.session.user) {
        console.log(req.body.commentId);
        const deleteComment = await commentDao.deleteComment(req.body.commentId);
        if (deleteComment) {
            res.json({status: "success"});
        } else {
            res.json({status: "error"});
        }
    }
});

module.exports = router;