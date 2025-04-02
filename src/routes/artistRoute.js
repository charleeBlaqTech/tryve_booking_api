const express = require("express"); 
const ArtistController = require("../controllers/ArtistsController");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const router = express.Router(); 

// Artist Routes
router.post("/", authMiddleWare, adminMiddleWare, ArtistController.createArtist);
router.get("/", ArtistController.getArtists);
router.get("/:id", ArtistController.getArtistById);
router.put("/:id", authMiddleWare, adminMiddleWare, ArtistController.updateArtist);
router.delete("/:id", authMiddleWare, adminMiddleWare, ArtistController.deleteArtist);

module.exports = router;
