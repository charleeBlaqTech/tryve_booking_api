const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UsersController");
const adminMiddleWare = require("../middlewares/auth.and.permissions/adminRoleWare");
const authMiddleWare = require("../middlewares/auth.and.permissions/authWare");
const {
  validateUserInputsForResetPassword,
  validateInstructorsInputsForResetPassword,
  validateUserInputsForUpdateProfile,
} = require("../middlewares/validators/validators");

router.post("/create/", adminMiddleWare, UserController.create);

module.exports = router;
