var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fighterSchema = new Schema({
    _id: { type: String, required: true, unique: true },

    

}, { _id: false });

var Fighter = mongoose.model('Fighter', eventSchema);

module.exports = Fighter;