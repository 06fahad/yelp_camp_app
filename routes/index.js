var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function (req, res) {
   res.render("landing.ejs"); 
});


router.get("/register", function(req, res) {
   res.render("register.ejs"); 
});

router.post("/register", function(req, res) {
    var newUser = new User ({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
   res.render("login.ejs"); 
});

router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
    
}),function(req, res) {
    
});

router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Logged out.");
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}

module.exports = router;