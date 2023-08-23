# Your database initialisation SQL here

DROP TABLE IF EXISTS `project_user`;
CREATE TABLE IF NOT EXISTS `project_user` (
    userid int(11) AUTO_INCREMENT,
    username varchar(50),
    password varchar(250),
    user_name varchar(50),
    birthday date,
    about mediumtext,
    avatar varchar(50),
    PRIMARY KEY (userid)
);


DROP TABLE IF EXISTS `project_article`;

CREATE TABLE IF NOT EXISTS `project_article` (
    articleId int(11) AUTO_INCREMENT,
    title varchar(350),
    publishedDate date,
    content longtext,
    autherId int(11),
    PRIMARY KEY (articleId),
    FOREIGN KEY (autherId) REFERENCES project_user(userid) ON DELETE CASCADE
);



DROP Table if exists project_likes;
CREATE TABLE IF NOT EXISTS project_likes (
    articleId int(11),
    userId int(11),
    PRIMARY KEY (articleId, userId),
    FOREIGN KEY (articleId) REFERENCES project_article(articleId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES project_user(userid) ON DELETE CASCADE
);

DROP TABLE IF EXISTS `project_comment`;
CREATE TABLE IF NOT EXISTS project_comment (
    commentId int(11) AUTO_INCREMENT,
    articleId int(11),
    username varchar(50),
    commentDate timestamp DEFAULT CURRENT_TIMESTAMP,
    commentContent tinytext,
    PRIMARY KEY (commentId),
    FOREIGN KEY (articleId) REFERENCES project_article(articleId) ON DELETE CASCADE
);


