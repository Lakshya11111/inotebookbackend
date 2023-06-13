const mongoose = require('mongoose');

const NotesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    defalt: "general"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('Notes', NotesSchema);

module.exports = User;
