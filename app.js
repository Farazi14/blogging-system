// TODO: Your app here
const express = require("express");
const app = express();
const port = 3000;

require('dotenv').config();

//Setup Handlebars
const handlebars = require("express-handlebars").engine;
app.engine("handlebars", handlebars({
    defaultLayout: "main",
    helpers: {
        ifCond: function (v1, v2, options) {
            if (v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        },
        or: function(v1, v2) {
            return v1 || v2;
        }
    },
}));
app.set("view engine", "handlebars");

app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const session = require("express-session");
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "CS719"
}));


const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use('/avatars', express.static(path.join(__dirname, "avatars")));
app.use('/images', express.static(path.join(__dirname, "images")));


const loginRouter = require("./routes/login-routes.js");
app.use(loginRouter);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

const articleRouter = require("./routes/article-routes.js");
app.use(articleRouter);

const profileRouter = require("./routes/profile-routes.js");
app.use(profileRouter);

const commentRouter = require("./routes/comment-routes.js");
app.use(commentRouter);

app.listen(port, function () {
    console.log(`App listening on port ${port}!`);
});




