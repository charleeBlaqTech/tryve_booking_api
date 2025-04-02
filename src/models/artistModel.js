const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  bio: {
    type: String
  },
  genre: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  socialLinks: {
    type: [String],
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


const Artist = mongoose.models.Artist || mongoose.model("Artist", ArtistSchema);

module.exports = Artist;
