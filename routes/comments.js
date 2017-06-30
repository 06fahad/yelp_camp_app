var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground) {
       if(!err) {
           res.render("Comments/new.ejs", {campground:campground, currentUser: req.user});
       }
   });
});

router.post("/", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (!err) {
            Comment.create(req.body.comment, function(err, comment) {
               if (!err) {
                   //add username and id to comment
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   //save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               } 
            });
        }    
    });
});

router.get("/:comment_id/edit", checkComment, function(req, res) {
  
              Comment.findById(req.params.comment_id, function(err, comment) {
                    if(err) {
                        console.log(err);
                    } else {
                        res.render("Comments/edit.ejs", {comment: comment, campground_id: req.params.id});
                    }
            
                });
    
});

router.put("/:comment_id", checkComment, function(req, res) {
        Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
          if(err){
              res.redirect("back");
          } else {
              res.redirect("/campgrounds/" + req.params.id );
          }
       }); 
});

router.delete("/:comment_id", checkComment, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("back");
        }  
   });
});

function checkComment(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
           if (err) {
               res.redirect("back");
           } else {
               if ((comment.author.id).equals(req.user.id)) {
                   next();
               } else {
                   res.redirect("back");
               }
           }  
        });
    } else {
        req.flash("error", "You must be logged in to do that.");
        res.redirect("/login");
    }
}


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}

module.exports = router;