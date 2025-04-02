const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("../../utils/status.constants");
const { encode_token, decode_token } = require("../../utils/token_mgt");
const User = require("../../models/userModel");

class AuthenticateUser {
  
  static async login(req, res) {
    try {
      if (!req.body) {
        res.status(status.HTTP_422_UNPROCESSABLE_ENTITY).json({error: `unprocessible request body`})
      } else {
        const foundUser = await User.findOne({userName: req.body?.user_name})
        if (!foundUser) {
          res.status(status?.HTTP_404_NOT_FOUND).json({error: `User with this username not found`})
        } else {
          const isVerifiedPassword = bcrypt.compareSync(req?.body?.password, foundUser?.password);

          if (!isVerifiedPassword) {
            res.status(status?.HTTP_401_UNAUTHORIZED).json({error: `password or email entered does not match`});
          } else {
            if (foundUser.is_archived === true) { 
              res.status(status?.HTTP_401_UNAUTHORIZED).json({error: `Contact support team to reactivate your account.`});
            } else {
              const token = jwt.sign(foundUser, process.env.SECRET_STRING,{expiresIn:'7d'})
              res.status(status?.HTTP_200_OK).json({token: token, data: foundUser})
            }
          }
        }
      }
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }

  static async refresh_token(req, res) {
    try {
      if (!req.body.refresh_token) {
        res
          .status(status.HTTP_422_UNPROCESSABLE_ENTITY)
          .json({ status: 422, message: "unprocessible request body" });
      } else {
        const userId = decode_token(req.body.refresh_token);
        if (!userId) {
          res.status(status?.HTTP_401_UNAUTHORIZED).json({
            status: 404,
            message: "token not provided or token has expired",
          });
        } else {
          const accessToken = encode_token(userId, "2d");
          const refreshToken = encode_token(userId, "7d");
          if (accessToken && refreshToken) {
            res.status(status?.HTTP_200_OK).json({
              status: 200,
              access_token: accessToken,
              refresh_token: refreshToken,
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

  static async destroy(req, res) {
    try {
      if (!req?.body?.access_token) {
        res
          .status(status?.HTTP_403_FORBIDDEN)
          .json({ status: 403, message: "You are not logged in" });
      }
      const userId = decode_token(req?.body?.access_token);
      if (!userId) {
        res.status(status.HTTP_404_NOT_FOUND).json({
          status: status.HTTP_404_NOT_FOUND,
          message: "UserId not found",
        });
      }

      const accessToken = encode_token(userId, "15s");
      res.status(status?.HTTP_200_OK).json({
        status: 200,
        access_token: accessToken,
        message: "you have been logged out successfully",
      });
    } catch (error) {
      res
        .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
        .json({ status: 500, message: error?.message });
    }
  }
}

module.exports = AuthenticateUser;
