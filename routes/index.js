var express = require('express');
var router = express.Router();
var request = require("request");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/userlist', function (req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e, docs){
        console.log(docs[1].username);
        res.render('userlist', {
           "userlist" : docs
       });
    });
});

// GET Ufc data and put it in database
router.post('/addUFCData', function(req, res){
    var db = req.ufcdb;

    request({
        url: "http://ufc-data-api.ufc.com/api/v3/iphone/events",
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var arrayOfEvents = JSON.parse(body);
            arrayOfEvents.forEach(function(ufcevent)
            { 
                console.log(ufcevent); 
            });

            var collection = db.get('ufcEvents');
            collection.insert(body);
            res.redirect("ufc");
        }
    });
});


router.get('/ufc', function (req, res) {
    var db = req.ufcdb;
    var collection = db.get('ufcEvents');


    collection.find({},{},function(e, docs){
        res.render('ufc', {
            "ufcEventsArray" : docs
        });
    });
});

router.get('/newuser', function(req, res){
	res.render('newuser', {title :  'Add New User'});
});


router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});



module.exports = router;
