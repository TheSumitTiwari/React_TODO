const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
 
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  date: {
    type: String,
    default: Date(Date.now()).toString(),
  },
  localAuth: {
    type: Boolean,
  },
  googleAuth: {
    id: {
      type: String,
    },
  },
});

module.exports = User = mongoose.model("user", UserSchema);
