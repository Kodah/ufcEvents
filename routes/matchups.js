var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Matchup = require('../models/matchup');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('matchups', { title: 'Match ups' });
});


router.get('/:eventID', function(req, res, next){
	Matchup.find({ event_id : req.params.eventID }).exec(function(err, matchups){
        if (err) throw err;

        res.render('matchups', {title: 'Matchups', matchups: matchups});
    });
});

module.exports = router;
