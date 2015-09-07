var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Event = require('./models/event.js');

mongoose.connect('mongodb://localhost/ufcevents');

console.log("Starting");

function parseEvents()
{
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
        }
        else {
            console.log('api error');
        }
    });
}

parseEvents();
console.log("Finished");
