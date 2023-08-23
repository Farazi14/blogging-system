const database = require("./database.js");

async function createUser(user) {
    const db = await database;
        const insertUser = await db.query(
            "insert into project_user (username, password, user_name, birthday, about, avatar) values (?, ?, ?, ?, ?, ?)",
            [user.username, user.password, user.name, user.birthday, user.about, user.avatar]);

    // Get the auto-generated ID value, and assign it back to the user object.
    user.id = insertUser.insertId;
    return user;
}
// discontinued after impletmenting encrypted password
// async function userAccountCheck(credentials) {
//     const db = await database;
//
//     const user = await db.query(
//         "select * from project_user where username = ? and password = ?",
//         [credentials.username, credentials.password]);
//
//     return user[0];
// }

async function checkIfUsernameExists(username) {
    const db = await database;
    const user = await db.query(
        "select userid, username, user_name, avatar, about,DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, password from project_user where username = ?",
        [username]);
    return user[0];
}

async function retriveUserById(userid) {
    const db = await database;
    const user = await db.query(
        "select userid, username, user_name, avatar, about,DATE_FORMAT(birthday, '%Y-%m-%d') AS birthday, password from project_user where userid = ?",
        [userid]);
    return user[0];
}

async function deleteUser(username) {
    const db = await database;
    await db.query(
        "delete from project_user where username = ?",
        [username]);
    return true;
}


async function updateUser(user) {
    const db = await database;
    await db.query(
        "update project_user set username = ?, password= ?, user_name = ?, birthday = ?, about = ?, avatar = ? where userid = ?",
        [user.username, user.password, user.name, user.birthday, user.about, user.avatar, user.userid]);
    return true;
}

module.exports = {
    createUser,
    checkIfUsernameExists,
    deleteUser,
    updateUser,
    retriveUserById
}
