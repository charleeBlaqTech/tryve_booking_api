const express = require("express");
const router = express.Router();
const authWare = require("../middlewares/auth.and.permissions/authWare");
const loginController = require("../controllers/Auth/AuthenticateUserController");
const {
  validateUserInputsForSignIn,
} = require("../middlewares/validators/validators");

router.post('/login/', loginController.login)
router.post("/logout/", authWare, loginController.destroy);

module.exports = router;
