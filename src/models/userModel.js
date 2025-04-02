const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { role } = require("../utils/user.roles.constant");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    maxlength: 100,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    maxlength: 255,
  },
  provider: {
    type: String,
    required: true,
    enum: ['local', 'google', 'facebook'],
  },
  providerId: {
    type: String
  },
  role: {
    type: String,
    required: true,
    default: role?.DEFAULT,
  },
  is_active: {
    type: Boolean,
    default: false,
  },
  is_archived: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});


//TO HASH NEW USER PASSWORD BEFORE SAVING THEIR DETAILS
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    let password = this.password;
    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);
    this.password = hashed;
    next();
  }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
