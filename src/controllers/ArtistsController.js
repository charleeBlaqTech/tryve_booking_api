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
      res.status(status.HTTP_201_CREATED).json(artist);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Get all artists
  static async getArtists(req, res) {
    try {
      const artists = await Artist.find().populate("createdBy", "name email");
      res.status(status.HTTP_200_OK).json(artists);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Get artist by ID
  static async getArtistById(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Artist not found" });
      res.status(status.HTTP_200_OK).json(artist);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Update artist
  static async updateArtist(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Artist not found" });
      if (artist.createdBy.toString() !== req.user.id) return res.status(status.HTTP_403_FORBIDDEN).json({ message: "Unauthorized" });

      // Update artist with new data
      Object.assign(artist, req.body);
      await artist.save();
      res.status(status.HTTP_200_OK).json(artist);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Delete artist
  static async deleteArtist(req, res) {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Artist not found" });
      if (artist.createdBy.toString() !== req.user.id) return res.status(status.HTTP_403_FORBIDDEN).json({ message: "Unauthorized" });

      await artist.remove();
      res.status(status.HTTP_200_OK).json({ message: "Artist deleted successfully" });
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }
}

module.exports = ArtistController;

