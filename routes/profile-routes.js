const express = require('express');
const router = express.Router();

// for hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userDao = require("../modules/user_dao.js");


router.get("/profile", function (req, res) {
    // loading avatar images
    const avatarDao = require("../modules/avatar_dao.js");
    const images = avatarDao.getAvatarsImages();
    const context = {
        profile: true, // for navbar
        images: images,
        existingUser: req.session.user || null
    }
    if(req.session.user) {
        res.render("new_existing_user", context);
    } else {
        res.redirect("/login?message=Please log in to post an article.");
    }
});

router.post("/profile", async function (req, res) {

    if(req.body.delete_account === 'true') {
        const delete_user = await userDao.deleteUser(req.body.username);
        if(delete_user) {
            delete req.session.user;
            res.redirect("/?message=Account has been deleted successfully!");
        } else {
            res.redirect("/?message=Account has not been deleted!");
        }
    }else {
        let encrypted_password;
        if (req.body.password === undefined || req.body.password === null || req.body.password === "") {
            encrypted_password = req.session.user.password;
        } else {
            try {
                encrypted_password = await bcrypt.hash(req.body.password, saltRounds);
            } catch (err) {
                res.redirect("./?message=" + err);
                return;
            }
        }

        let current_avatar;
        if(req.body.selectedAvatar === null){
            current_avatar = req.session.user.avatar;
        }else{
            current_avatar = req.body.selectedAvatar;
        }
        const user = {
            userid: req.session.user.userid,
            username: req.body.username,
            password: encrypted_password,
            name: req.body.name,
            birthday: req.body.birthday,
            about: req.body.about,
            avatar: current_avatar
        }

        const update_user = await userDao.updateUser(user);
        if(update_user) {

            res.redirect("/?message=Profile has been updated successfully! Please log in again to see the changes to your profile.");
        } else {
            res.redirect("/?message=Profile has not been updated!");
        }
    }
});


module.exports = router;