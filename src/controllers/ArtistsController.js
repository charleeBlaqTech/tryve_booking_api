const Artist = require("../models/artistModel");
const status = require("../utils/status.constants");
const { expressFileUploader } = require("../utils/fileUploads");
const path = require("path");

class ArtistController {

  // Create an artist
  static async createArtist(req, res) {
    try {
      const { name, bio, genre, image, socialLinks } = req.body;
      const artist = new Artist({
        name,
        bio,
        genre,
        image,
        socialLinks,
        createdBy: req.user.id,
      });
      await artist.save();
      res.status(201).json(artist);
    } catch (error) {
      res.status(500).json({ message: "Error creating artist", error });
    }
  }

  // Get all artists
  static async getArtists(req, res) {
    try {
      const artists = await Artist.find().populate("createdBy", "name email");
      res.status(200).json(artists);
    } catch (error) {
      res.status(500).json({ message: "Error fetching artists", error });
    }
  }

  // Get artist by ID
  static async getArtistById(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(404).json({ message: "Artist not found" });
      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ message: "Error fetching artist", error });
    }
  }

  // Update artist
  static async updateArtist(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(404).json({ message: "Artist not found" });
      if (artist.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

      // Update artist with new data
      Object.assign(artist, req.body);
      await artist.save();
      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ message: "Error updating artist", error });
    }
  }

  // Delete artist
  static async deleteArtist(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(404).json({ message: "Artist not found" });
      if (artist.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

      await artist.remove();
      res.status(200).json({ message: "Artist deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting artist", error });
    }
  }
}

module.exports = ArtistController;

