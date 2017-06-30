var mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment");
    
var data = [
        {
            name: "Clouds Rest",
            image: "https://images.pexels.com/photos/198979/pexels-photo-198979.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
            description: "Regione volutpat id est, nec cu noluisse evertitur, cu per recusabo interpretaris. Ea falli consetetur duo, pro soleat accusata argumentum te, delenit omittam ea mel. Consul malorum accusamus eos ad, cu cetero ceteros ius. Mazim utamur oporteat vis an, vide appareat adipiscing mea cu, quod ludus vix ne. Eos quodsi scripta ex, usu brute accusam verterem no, in liber nemore sit."
        },
         {
            name: "LOLZYZ",
            image: "https://images.pexels.com/photos/192518/pexels-photo-192518.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
            description: "Regione volutpat id est, nec cu noluisse evertitur, cu per recusabo interpretaris. Ea falli consetetur duo, pro soleat accusata argumentum te, delenit omittam ea mel. Consul malorum accusamus eos ad, cu cetero ceteros ius. Mazim utamur oporteat vis an, vide appareat adipiscing mea cu, quod ludus vix ne. Eos quodsi scripta ex, usu brute accusam verterem no, in liber nemore sit."
        },
         {
            name: "Starry Night",
            image: "https://images.pexels.com/photos/127634/pexels-photo-127634.jpeg?w=940&h=650&auto=compress&cs=tinysrgb",
            description: "Regione volutpat id est, nec cu noluisse evertitur, cu per recusabo interpretaris. Ea falli consetetur duo, pro soleat accusata argumentum te, delenit omittam ea mel. Consul malorum accusamus eos ad, cu cetero ceteros ius. Mazim utamur oporteat vis an, vide appareat adipiscing mea cu, quod ludus vix ne. Eos quodsi scripta ex, usu brute accusam verterem no, in liber nemore sit."
        }
    ];    
    
function seedDB() {
    Campground.remove({}, function(err) {
        console.log("removed campgrounds");
        
        //add some campgrounds
        data.forEach(function(seed) {
          Campground.create(seed, function(err, campground) {
              if(!err) {
                  console.log("Added a campground");
                  //add comment
                  Comment.create({
                      text: "Lol this was aweful",
                      author: "Homer"
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Created new comment");
                        }
                        
                    });
              } 
          }); 
        });
       
    });
    
    
}

module.exports = seedDB;