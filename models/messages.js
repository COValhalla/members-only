const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, max: 100 },
  message: { type: String, required: true, max: 1000 },
  author: { type: Schema.Types.ObjectId, ref: 'Members', required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('messages', MessageSchema);
