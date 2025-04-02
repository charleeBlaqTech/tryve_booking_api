const express = require("express");
const router = express.Router();
const registerController = require("../controllers/Auth/RegisterUserController");
const guestMiddleware = require("../middlewares/auth.and.permissions/guestWare");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const {
  validateUserInputsForSignUp,
  validateUserInputsForRole,
  comparePassword,
} = require("../middlewares/validators/validators");

router.post("/signup/", validateUserInputsForSignUp, comparePassword, registerController.signup);

module.exports = router;
