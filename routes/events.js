var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Event = require('../models/event');

/* GET home page. */
router.get('/', function(req, res, next) {
    // sort by eventDate descending
    Event.find({featureImageUrl : /^((?!EventPlaceholder).)*$/ }).sort('-eventDate').exec(function(err, events){
        if (err) throw err;

        res.render('events', {title: 'Events', events: events});
    });
});

router.post('/delete', function(req, res) {
    Event.remove({}, function(err){
        if (err) throw err;
        res.redirect('/events');
    });
});

router.post('/', function(req, res, next) {
    request({
        url: "http://ufc-data-api.ufc.com/api/v3/iphone/events",
        json: true
    }, function (error, response, body) {

        if(!error && response.statusCode == 200) {
            
            body.forEach(function(item) {
                var ufcevent = new Event({
                    _id: item.id.toString(),
                    eventDate: new Date(item.event_date),
                    endEventDateGmt: new Date(item.end_event_dategmt),
                    baseTitle: item.base_title,
                    titleTagLine: item.title_tag_line,
                    featureImageUrl: item.feature_image,
                    eventStatus: item.event_status,
                    arena: item.arena,
                    location: {
                        name: item.location
                    }
                });


                Event.where({_id: item.id}).findOne(function (err, existing){
                    if (err) throw err;

                    if (!existing) {
                        ufcevent.save(function(dberror){
                            if (dberror) throw dberror;
                        });
                    }
                });

            });

            res.redirect('/events');
        }
        else {
            console.log('api error');
        }
    });
});

module.exports = router;