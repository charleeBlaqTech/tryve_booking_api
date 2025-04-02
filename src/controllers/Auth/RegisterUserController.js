const status = require("../../utils/status.constants");
const {
  check_if_user_exist_with_Email,
  check_if_user_exist_with_id,
} = require("../../utils/userExist");
const User = require("../../models/userModel");
const { role } = require("../../utils/user.roles.constant");
const { generateOtp } = require("../../utils/generate_otp");
const path = require("path");

class RegisterUser {

  static async index(req, res) {
    try {
      res.render('register')
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async signup(req, res) {
    try {
      if (!req.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY).render('register', {error: `unprocessible request body`})
      } else {
        const foundUser = await check_if_user_exist_with_Email(
          req?.body?.email
        );
        if (foundUser) {
          res
            .status(status?.HTTP_409_CONFLICT).render('register', {error: `User With This Email already exist`});
        } else {
          // console.log(req.body)
          const newUser = await new User({
            fullName: req.body.full_name,
            userName: req.body.user_name,
            email: req.body.email,
            password: req.body.password,
            is_active: true,
            role: role?.GUEST,
          });

          if (newUser) {
            await newUser.save();
            res.status(status?.HTTP_201_CREATED).render("login", {
                message: `${newUser?.fullName} your wellsFago Ibanking account was created successfully`,
              });
          }
        }
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }
}

module.exports = RegisterUser;
