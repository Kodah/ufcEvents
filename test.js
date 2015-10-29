var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var Event = require('./models/event.js');
var Matchup = require('./models/matchup.js');

// mongoose.connect('mongodb://localhost/ufcevents');
mongoose.connect('mongodb-server.cloudapp.net:27017/');



console.log("Starting Parsing");

function parseMatchups (eventIDs)
{
    do {
        eventID = eventIDs.pop();
        request({
        url: "http://ufc-data-api.ufc.com/api/v3/iphone/events/" + eventID + "/fights",
        json: true
    }, function (error, response, body) {

        if(!error && response.statusCode == 200) {
            
            body.forEach(function(item) {
                var matchUp = new Matchup({
                    _id: item.id.toString(),
                    event_id: item.event_id,
                    fight_description: item.fight_description,

                    fighter1_id: item.fighter1_id,
                    fighter1_first_name: item.fighter1_first_name,
                    fighter1_last_name: item.fighter1_last_name,
                    fighter1_nickname: item.fighter1_nickname,
                    fighter1_weight_class: item.fighter1_weight_class,
                    fighter1_full_body_image: item.fighter1_full_body_image,
                    fighter1_record: item.fighter1record,
                   
                    fighter2_id: item.fighter2_id,
                    fighter2_first_name: item.fighter2_first_name,
                    fighter2_last_name: item.fighter2_last_name,
                    fighter2_nickname: item.fighter2_nickname,
                    fighter2_weight_class: item.fighter2_weight_class,
                    fighter2_full_body_image: item.fighter2_full_body_image,
                    fighter2_record: item.fighter2record,
                });


                Matchup.where({_id: item.id}).findOne(function (err, existing){
                    if (err) throw err;
                    if (!existing) {
                        matchUp.save(function(dberror){
                            if (dberror) 
                            {
                                throw dberror;
                            }
                            else
                            {
                                console.log("parsed fight "+matchUp.fighter1_last_name+" vs "+ matchUp.fighter2_last_name);
                            }
                                
                        });
                    }
                });
            });
        }
        else {
            console.log('Matchups api error' + error);
        }
    });
    }
    while (eventIDs.length > 0)
    

    console.log("Finished parsing matchups");
}

function parseEvents()
{
    var eventIDs = [];

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

                console.log("Inserted event " + item.base_title );
                eventIDs.push(item.id.toString());
            });
        }
        else {
            console.log('Events api error' + error);
        }

        console.log("Finished Parsing Events");
        parseMatchups(eventIDs);

    });
    console.log("Finished Parsing Events");
}

parseEvents();
