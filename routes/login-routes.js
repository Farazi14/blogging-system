const express = require("express");
const router = express.Router();

const userDao = require("../modules/user_dao.js");

// for hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/login', function (req, res) {


    if (req.session.user) {
        res.redirect("/");
    }else {
        const context = {
            message: req.query.message,
            onLoginPage: true
        }

        res.render('login', context);
    }
});

router.post("/login", async function (req, res) {
    const credentials ={
        username : req.body.username,
        password : req.body.password
    }
    const user = await userDao.checkIfUsernameExists(credentials.username); // get user by username
    if(user) {
        //compare the password entered with the hashed password stored in the database
        bcrypt.compare(credentials.password, user.password, function(err, result) {
            if(result) {
                req.session.user = user; // Set the user in the session if password is correct
                res.redirect("/");
            }
            else {
                res.redirect("./login?message=Incorrect username or password!");
            }
        });
    } else {
        res.redirect("./login?message=Incorrect username or password!");
    }
});


router.get('/newUser', function (req, res) {
    const avatarDao = require("../modules/avatar_dao.js");
    const images = avatarDao.getAvatarsImages();
    const context = {
        images: images,
        new_user: true, // you be used to display new_user handlebars view
    };
    res.render('new_existing_user', context);
});

router.post('/newUser', function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if(err) {
            res.redirect("./newUser?message=" + err);
            return;
        }
        const new_user = {
            username : req.body.username,
            password : hash, // Now storing the hashed password, not the plaintext one.
            name : req.body.name,
            birthday : req.body.birthday,
            about :req.body.about,
            avatar: req.body.selectedAvatar
        }
        userDao.createUser(new_user).then(function() {
            res.redirect("./login?message=Account created successfully! Please login.");
        }).catch(function(err) {
            res.redirect("./newUser?message=" + err);
        });
    });
});

router.get("/logout", function (req, res) {
    if (req.session.user) {
        delete req.session.user;
    }
    res.redirect("./login?message=Logged out successfully!");
});

router.get("/checkUsername", async function (req, res) {
    const username = req.query.username;
    const user = await userDao.checkIfUsernameExists(username);
    if(user) {
        res.json({ isTaken: true });
    } else {
        res.json({ isTaken: false });
    }
});

module.exports = router;