const database = require("./database.js");

async function createComment(comment) {
    const db = await database;
    const insertComment = await db.query(
        "INSERT INTO project_comment (articleId, username, commentContent) VALUES (?, ?, ?)",
        [comment.articleId, comment.username, comment.comment,]);

    comment.id = insertComment.insertId;
    return comment;
}

async function retrieveCommentsByArticleId(articleId) {
    const db = await database;
    const comments= await db.query(
        "SELECT commentId, articleId, username, DATE_FORMAT(commentDate, '%d/%m/%Y') AS commentDate, DATE_FORMAT(commentDate, '%H:%i:%s') AS commentTime, commentContent FROM project_comment WHERE articleId = ?",
        [articleId]);
    return comments;
}

async function deleteComment(commentId) {
    const db = await database;
    await db.query(
        "DELETE FROM project_comment WHERE commentId = ?",
        [commentId]);
    return true;
}

module.exports = {
    createComment,
    retrieveCommentsByArticleId,
    deleteComment
}