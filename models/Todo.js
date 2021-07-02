const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  userId:{
    type: String,
    required: true,
  },
  task: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
    required: true,
    default:false
  },
  stared: {
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: String,
    default: Date(Date.now()).toString(),
  },
});

module.exports = Todo = mongoose.model("todo", TodoSchema);
