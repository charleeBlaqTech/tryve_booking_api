const express = require("express");
const BookingController = require("../controllers/BookingController");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const router = express.Router();



router.post("/", authMiddleWare, BookingController.createBooking);
router.get("/verify", BookingController.verifyPayment);
router.get("/", authMiddleWare, BookingController.getUserBookings);
router.get("/admin", authMiddleWare, adminMiddleWare, BookingController.getAllBookings); // Admin-only route module.exports = router;
