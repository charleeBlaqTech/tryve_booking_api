const Event = require("../models/eventModel");

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
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error creating event", error });
    }
  }

  // Get all events
  static async getEvents(req, res) {
    try {
      const events = await Event.find({}).lean().populate("artist", "name genre");
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Error fetching events", error });
    }
  }

  // Get event by ID
  static async getEventById(req, res) {
    try {
      const event = await Event.findById(req.params.id).populate("artist");
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error fetching event", error });
    }
  }

  // Update event
  static async updateEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

      // Update event with new data
      Object.assign(event, req.body);
      await event.save();
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Error updating event", error });
    }
  }

  // Delete event
  static async deleteEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (event.createdBy.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

      await event.remove();
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting event", error });
    }
  }

}

module.exports = EventController;
