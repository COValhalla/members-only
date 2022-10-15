const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: { type: String, required: true, max: 200 },
  password: { type: String, required: true, max: 200 },
  status: { type: String, enum: ['guest', 'member', 'admin'], required: true },
});

module.exports = mongoose.model('Members', MemberSchema);
