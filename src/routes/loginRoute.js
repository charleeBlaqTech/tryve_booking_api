const express = require("express");
const router = express.Router();
const authWare = require("../middlewares/auth.and.permissions/authWare");
const loginController = require("../controllers/Auth/AuthenticateUserController");
const {
  validateUserInputsForSignIn,
} = require("../middlewares/validators/validators");

router.route("/login/").post(loginController.login).get(loginController.index)
router.post("/refresh_token/", loginController.refresh_token);
router.post("/logout/", authWare, loginController.destroy);

module.exports = router;
