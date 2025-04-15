const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  options: [
    {
      text: String,
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  duration: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  votedBy: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      option: String  // Change to store a single selected option as a string
    }
  ]
});

module.exports = mongoose.model('Poll', pollSchema);
