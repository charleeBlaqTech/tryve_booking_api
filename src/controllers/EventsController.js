const Event = require("../models/eventModel");
const status = require("../utils/status.constants");

class EventController {

  // Create an event
  static async createEvent(req, res) {
    try {
      const { title, description, date, location, artist, ticketsAvailable, ticketPrice } = req.body;
      const event = new Event({
        title,
        description,
        date,
        location,
        artist,
        ticketsAvailable,
        ticketPrice,
        createdBy: req.user._id,
      });
      await event.save();
      res.status(status.HTTP_201_CREATED).json(event);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Get all events
  static async getEvents(req, res) {
    try {
      const events = await Event.find({}).lean().populate("artist", "name genre");
      res.status(status.HTTP_200_OK).json(events);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Get event by ID
  static async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id).populate("artist");
      if (!event) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Event not found" });
      res.status(status.HTTP_200_OK).json(event);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Event not found" });
      if (event.createdBy.toString() !== req.user.id) return res.status(status.HTTP_403_FORBIDDEN).json({ message: "Unauthorized" });

      // Update event with new data
      Object.assign(event, req.body);
      await event.save();
      res.status(status.HTTP_200_OK).json(event);
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(status.HTTP_404_NOT_FOUND).json({ message: "Event not found" });
      if (event.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

      await event.remove();
      res.status(status.HTTP_200_OK).json({ message: "Event deleted successfully" });
    } catch (error) {
      res
      .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
      .json({ status: 500, message: error?.message });
    }
  }

}

module.exports = EventController;
