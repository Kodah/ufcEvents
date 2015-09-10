var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchupSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    event_id: String,
    fight_description: String,

	fighter1_id: String,
    fighter1_first_name: String,
    fighter1_last_name: String,
    fighter1_nickname: String,
    fighter1_weight_class: String,
	fighter1_full_body_image: String,
    fighter1record: String,
   
    fighter2_id: String,
    fighter2_first_name: String,
    fighter2_last_name: String,
    fighter2_nickname: String,
    fighter2_weight_class: String,
	fighter2_full_body_image: String,
    fighter2record: String,

    

}, { _id: false });

var Matchup = mongoose.model('Matchup', matchupSchema);

module.exports = Matchup;