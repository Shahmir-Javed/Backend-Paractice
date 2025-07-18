const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");
const { log } = require("console");



const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/register", (req, res) => {
    const { username, password, email, age } = req.body;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await User.create({
                name: username,
                email: email,
                password: hash,
                age: age
            })
            let token = jwt.sign({ email }, "SecretKey");
            console.log("Token", token);
            res.cookie("token", token);

            res.send(user);
        })
    })
});

app.get('/login', (req, res) => {
    res.render("login");
})

app.post('/login', async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user) res.send("Something went wrong")
    bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({email: user.email }, "SecretKey");
            res.cookie("token", token);
            res.send("Success Login");
        } else {
            res.send("Something went wrong");
        }
    })
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});