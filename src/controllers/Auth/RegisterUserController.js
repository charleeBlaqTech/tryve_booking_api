const status = require("../../utils/status.constants");
const {check_if_user_exist_with_Email,} = require("../../utils/userExist");
const User = require("../../models/userModel");
const { role } = require("../../utils/user.roles.constant");
const path = require("path");

class RegisterUser {

  static async signup(req, res) {
    try {
      if (!req.body) {
        res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({error: `unprocessible request body`})
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
            provider: 'local',
            role: role?.DEFAULT,
          });

          if (newUser) {
            await newUser.save();
            res.status(status?.HTTP_201_CREATED).json({
                message: `${newUser?.fullName} your account was created successfully`,
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
