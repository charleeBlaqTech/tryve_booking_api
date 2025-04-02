const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const status = require("../utils/status.constants");

const { expressFileUploader } = require("../utils/fileUploads");
const path = require("path");

class DashboardController {
    static async index(req, res) {
        if(!req.user){
            res.render('login', {message: 'Please login to access account dashboard'})
        }
        try {
            const userData = await User.findById(req.user._id).populate('account transactions').sort({createdAt: -1})

        } catch (error) {
          res
            .status(status?.HTTP_500_INTERNAL_SERVER_ERROR)
            .json({ status: 500, message: error?.message })
        }
    }
}

module.exports = DashboardController;
