var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var matchupSchema = new Schema({
    _id: { type: String, required: true, unique: true },

    

}, { _id: false });

var Matchup = mongoose.model('Matchup', eventSchema);

module.exports = Matchup;