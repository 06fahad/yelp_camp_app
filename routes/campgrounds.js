var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
    Campground.find({}, function(err, all_campgrounds) {
        if (!err) {
             res.render ("Campgrounds/campgrounds.ejs", {campgrounds:all_campgrounds});
        }
    });
   
});

router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.description;
    var pr = req.body.price;
    Campground.create({
        name: name,
        image: img,
        description: desc,
        price: pr
    }, function(err, campground) {
        if (!err) {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/new", isLoggedIn, function(req, res) {
    res.render("Campgrounds/new.ejs");
});

router.get("/:id", function(req, res) {
    var campgroundID = req.params.id;
    Campground.findById(campgroundID).populate("comments").exec( function(err, campground) {
        if (!err) {
            res.render("Campgrounds/show.ejs", {campground:campground, req:req});
        } else {
            console.log(err);
        }
    });
   
   
});

//Edit route
router.get("/:id/edit", checkUser, function(req, res) {
   Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("Campgrounds/edit.ejs", {foundCampground: foundCampground});
        }
        
   });
  
});

//update route
router.put("/:id", checkUser, function(req, res) {
    
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
       if(err) {
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//delete route
router.delete("/:id",checkUser, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
       if (!err) {
           res.redirect("/campgrounds");
       } 
    });
});


function checkUser(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err) {
               res.redirect("back");
           } else {
               console.log(foundCampground.author.id);
               console.log(req.user.id);
               if((foundCampground.author.id).equals(req.user.id)) {
                   next();
               } else {
                   res.redirect("/campgrounds");
               }
           } 
        });
    } else {
        res.redirect("/login");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //this line adds itself to the next page that loads
    //so it won't flash until /login page renders
    //the first parameters is the key, the second is value/message
    req.flash("error", "You must be logged in to do that.");
    res.redirect("/login");
}

module.exports = router;