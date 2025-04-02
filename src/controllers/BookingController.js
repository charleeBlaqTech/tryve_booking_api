const Booking = require("../models/bookingModel"); 
const Event = require("../models/eventModel"); 
const status = require("../utils/status.constants");
const axios = require('axios')


class BookingController {

  static async getAllBookings(req, res) {
    try {
      const bookings = await Booking.find().populate("user", "name email").populate("event");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  }

  static async createBooking(req, res) {
    try {
      const { eventId, tickets } = req.body;
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
      if (tickets > event.ticketsAvailable) return res.status(400).json({ message: "Not enough tickets available" });

      const totalAmount = tickets * event.ticketPrice;
      const reference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`; 

      // Create booking with pending status
      const booking = new Booking({
        user: req.user.id,
        event: eventId,
        tickets,
        totalAmount,
        reference,
      });
      await booking.save();

      // Initialize Paystack Payment
      const paystackResponse = await axios.post("https://api.paystack.co/transaction/initialize",
        {
          email: req.user.email,
          amount: totalAmount * 100,
          reference,
          callback_url: `${process.env.CLIENT_URL}/payment-success`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(201).json({ message: "Payment initiated", paystackUrl: paystackResponse.data.data.authorization_url });
    } catch (error) {
      res.status(500).json({ message: "Error initiating payment", error: error.response?.data || error.message });
    }
  }

  static async verifyPayment(req, res) {
    try {
      const { reference } = req.query;
      const paystackResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      if (paystackResponse.data.data.status === "success") {
        const booking = await Booking.findOneAndUpdate(
          { reference },
          { paymentStatus: "paid" },
          { new: true }
        );

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        // Reduce available tickets
        await Event.findByIdAndUpdate(booking.event, {
          $inc: { ticketsAvailable: -booking.tickets },
        });

        return res.status(200).json({ message: "Payment verified successfully", booking });
      }

      return res.status(400).json({ message: "Payment failed" });
    } catch (error) {
      res.status(500).json({ message: "Error verifying payment", error: error.response?.data || error.message });
    }
  }

  static async getUserBookings(req, res) {
    try {
      const bookings = await Booking.find({ user: req.user.id }).populate("event");
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Error fetching bookings", error });
    }
  }
}

module.exports = BookingController;
