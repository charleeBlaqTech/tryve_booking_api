const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("../utils/status.constants");
const {
  check_if_user_exist_with_Email,
  check_if_user_exist_with_id,
} = require("../utils/userExist");
const { encode_token, decode_token } = require("../utils/token_mgt");
const { generateOtp, generateTempPassword } = require("../utils/generate_otp");
const { role } = require("../utils/user.roles.constant");
const { expressFileUploader } = require("../utils/fileUploads");
const path = require("path");

class UsersController {
  
  static async create(req, res) {
    if (!req?.user) {
      res
        .status(status?.HTTP_403_FORBIDDEN)
        .json({ status: 403, message: "Unauthorized" });
    }
    try {
      if (!req?.body) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      } else {
        const foundUser = await check_if_user_exist_with_Email(
          req?.body?.email
        );
        if (foundUser) {
          res.status(status?.HTTP_409_CONFLICT).json({
            status: 409,
            message: "User With This Email already exist",
          });
        } else {
          const tempPassword = generateTempPassword(12);
          const newUser = await new User({
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            preferredName: req.body.preferred_name
              ? req.body.preferred_name
              : null,
            email: req.body.email,
            phoneNo: req.body.phone_number,
            country: req.body.country,
            gender: req.body.gender,
            stateCity: req.body.state,
            password: tempPassword,
            role: role?.TUTOR,
            is_active: true,
          });

          await newUser.save();
        }
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }


  static async update_account_password(req, res) {
    try {
      if (
        !req?.body
      ) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      } else {
        const foundUser = await User.findOne({userName: req.body.username})
        if (!foundUser) {
          res
            .status(status?.HTTP_404_NOT_FOUND)
            .json({ status: 404, message: "User not found" });
        } else {

          const temporalPasswordCorrect = bcrypt.compareSync(
            req?.body?.old_password,
            foundUser.password
          );

          if (!temporalPasswordCorrect) {
            res.status(status?.HTTP_400_BAD_REQUEST).json({
              status: 400,
              message: "Temporal Password entered not correct",
            });
          } else {
            foundUser.password = req?.body?.new_password;
            await foundUser.save();
            res
              .status(status?.HTTP_200_OK)
              .json({ status: 200, message: "Password reset successfully" });
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

module.exports = UsersController;
