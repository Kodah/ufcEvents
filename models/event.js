var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
    _id: { type: String, required: true, unique: true },
    eventDate: Date,
    endEventDateGmt: Date,
    baseTitle: String,
    titleTagLine: String,
    featureImageUrl: String,
    eventStatus: String,
    arena: String,
    location: {
        name: String,
        latitude: Number,
        longitude: Number
    }
}, { _id: false });

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;