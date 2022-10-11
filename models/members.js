const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 200 },
});

module.exports = mongoose.model('Members', MemberSchema);
