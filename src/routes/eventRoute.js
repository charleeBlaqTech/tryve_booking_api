const express = require("express"); 
const EventController = require("../controllers/EventsController");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const router = express.Router(); 

// Event Routes
router.post("/", authMiddleWare, adminMiddleWare, EventController.createEvent);
router.get("/", EventController.getEvents);
router.get("/:id", EventController.getEventById);
router.put("/:id", authMiddleWare, adminMiddleWare, EventController.updateEvent);
router.delete("/:id", authMiddleWare, adminMiddleWare, EventController.deleteEvent);

module.exports = router;
