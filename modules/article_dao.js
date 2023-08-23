const database = require("./database.js");

async function allArticles() {
    const db = await database;
    // retrive all articles including the author's username
    const articles = await db.query(
        // discontinued after implementing like count feature.
        //"SELECT articleid, username, title, content, DATE_FORMAT(publishedDate, '%d/%m/%Y') AS formattedDate FROM project_article, project_user WHERE project_user.userid = project_article.autherId;");
        "SELECT a.*, u.username, COUNT(l.articleid) AS likesCount, DATE_FORMAT(a.publishedDate, '%d/%m/%Y') AS formattedDate FROM project_article a LEFT JOIN project_likes l ON a.articleid = l.articleid LEFT JOIN project_user u ON a.autherId = u.userid GROUP BY a.articleid");
    return articles;
}

async function createArticle(article) {

    const db = await database;
    const result = await db.query(
        "INSERT INTO project_article (title, publishedDate, content, autherId) VALUES (?, ?, ?, ?)",
        [article.title, article.date, article.content, article.userid]);
    return result;

}

async function updateArticle(article) {
    const db = await database;
    const result = await db.query(
        "UPDATE project_article SET title = ?, publishedDate = ?, content = ? WHERE articleid = ?",
        [article.title, article.date, article.content, article.articleid]);
    return result;

}

async function deleteArticle(article) {
    const db = await database;
    const result = await db.query(
        "DELETE FROM project_article WHERE articleid = ?",
        [article]);
    return result;
}


async function likeArticle(articleid, userid) {
    const db = await database;
    const result = await db.query(
        "INSERT INTO project_likes (articleid, userid) VALUES (?, ?)",
        [articleid, userid]);
    return result;
}

async function likedArticlesByUser(userId) {
    const db = await database;
    const likedArticles = await db.query(
        "SELECT articleid FROM project_likes WHERE userid = ?", [userId]);
    return likedArticles.map(article => article.articleid); // return only the article IDs
}

async function likeCount(articleid) {
    const db = await database;
    const result = await db.query(
        "SELECT COUNT(userId) as total_likes FROM project_likes WHERE articleId = ?;",
        [articleid]);
    return result[0];
}


async function retriveArticle(articleid) {
    const db = await database;
    const article = await db.query(
        "SELECT *,DATE_FORMAT(publishedDate, '%d/%m/%Y') AS formattedDate FROM project_article WHERE articleid = ?", [articleid]);
    return article[0];

}

module.exports = {
    allArticles,
    deleteArticle,
    likeArticle,
    likedArticlesByUser,
    createArticle,
    retriveArticle,
    updateArticle,
    likeCount
}