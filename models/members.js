const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  password: { type: String, required: true, max: 200 },
  status: {
    type: String,
    required: true,
    enum: ['member', 'admin'],
  },
});

module.exports = mongoose.model('Members', MemberSchema);
