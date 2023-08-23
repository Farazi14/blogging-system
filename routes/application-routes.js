const express = require('express');
const router = express.Router();

const articleDao = require('../modules/article_dao.js');

router.get("/", async function (req, res) {
   const articles = await articleDao.allArticles();
    let likedArticles = [];
    if (req.session.user) {
        likedArticles = await articleDao.likedArticlesByUser(req.session.user.userid);
    }
    // Add 'isAuthor' field to each article so that we can display edit/delete buttons if the user is the author.
    articles.forEach(article => {
        article.isAuthor = req.session.user && req.session.user.username === article.username;
        article.liked = likedArticles.includes(article.articleId);
    });

   //so that all articles are available regardless of whether the user is logged in or not
   res.locals.articles = articles;

   const context = {
        homepage: true,
        validUser: req.session.user,
        message: req.query.message
   }
   if(req.session.user) {
      res.render("home", context);
   } else {
        res.render("home", {message: context.message});
   }
});


module.exports = router;

