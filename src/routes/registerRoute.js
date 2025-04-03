const express = require("express");
const router = express.Router();
const registerController = require("../controllers/Auth/RegisterUserController");
const {
  validateUserInputsForSignUp,
  comparePassword,
} = require("../middlewares/validators/validators");


router.post("/signup/", validateUserInputsForSignUp, comparePassword, registerController.signup);

module.exports = router;
