const express = require('express');
const router = express.Router();

const articleDao = require('../modules/article_dao.js');


router.get("/postArticle", async function (req, res) {
    if(req.session.user) {
    //edit article implementation
    let articleId;
    let article;

    if(req.query.articleId){
        articleId = req.query.articleId;
        article = await articleDao.retriveArticle(articleId);
    }
    //post article implementation
    const context = {
        postArticle: true,
        validUser: req.session.user || null,
        article: article
    }

        res.render("article_template", context);
    } else {
        res.redirect("/login?message=Please log in to post an article.");
    }
});


// delete article handler, server side
router.delete('/articles/:articleid', async (req, res) => {

    try {
        await articleDao.deleteArticle(req.params.articleid);
        res.sendStatus(200);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: 'Error deleting article'});
    }
});

router.post("/like/:articleId", async function (req, res) {
    if (!req.session.user) {

        res.json({ success: false, message: "You must be logged in to like an article.", redirectTo: "/login?message=Please log in to like an article." });
        return;
    }

    try {

        await articleDao.likeArticle(req.params.articleId, req.session.user.userid);
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


router.post("/newArticle", async function (req, res) {
    if (!req.session.user) {
        res.redirect("/login?message=Please log in to post an article.");
        return;
    }else {
        // formating the date
        let date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let year = date.getFullYear();

        let formattedDate = `${year}-${month}-${day}`;

        const new_article = {
            title: req.body.title,
            content: req.body.content_body,
            userid: req.session.user.userid,
            date: formattedDate
        }
        const create_article = await articleDao.createArticle(new_article);

        if (create_article) {
            res.redirect("/?message=Article Posted!");
        } else {
            res.redirect("/?message=Article Post Failed!");
        }
    }

});


router.post("/updateArticle", async function (req, res) {
    if (!req.session.user) {
        res.redirect("/login?message=Please log in to update the article.");
        return;
    }else {

        // formating the date
        let date = new Date();
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        let year = date.getFullYear();

        let formattedDate = `${year}-${month}-${day}`;

            const update_article = {
            articleid: req.body.articleId,
            title: req.body.title,
            content: req.body.content_body,
            userid: req.session.user.userid,
            date: formattedDate
        }
        const article_updated = await articleDao.updateArticle(update_article);

        if (article_updated) {
            res.redirect("/?message=Article Updated!");
        } else {
            res.redirect("/?message=Article Update Failed!");
        }
    }
});


router.get("/readArticle", async function (req, res) {
    if(req.session.user) {
        //read article implementation
        article = await articleDao.retriveArticle(req.query.articleId);
        likedArticles = await articleDao.likedArticlesByUser(req.session.user.userid);
        article.liked = likedArticles.includes(article.articleId);
        like_count = await articleDao.likeCount(article.articleId);
        article.like_count = Number(like_count.total_likes);
        userDao = require('../modules/user_dao.js');
        autherInfo = await userDao.retriveUserById(article.autherId);

        const commentDao = require('../modules/comment_dao.js');
        article.comments = await commentDao.retrieveCommentsByArticleId(article.articleId);


        const context = {
            validUser: req.session.user || null,
            article: article,
            auther: autherInfo,
            userIsAuthor: req.session.user.userid === article.autherId
        }

        res.render("read_article", context);
    } else {
        res.redirect("/login?message=Please log in to read the article.");
    }
});

module.exports = router;