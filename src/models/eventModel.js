const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  location: {
    type: String,
    required: true
  },
  ticketsAvailable: {
    type: Number,
    default: 100
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required : true
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required : true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});


const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

module.exports = Event;