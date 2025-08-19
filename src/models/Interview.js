
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, default: '' }
}, { timestamps: true });

const answerSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ question: String, answer: String }],
  score: { type: Number, default: 0 }
}, { timestamps: true });

const interviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['open', 'booked', 'completed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answers: [answerSchema],
  feedbacks: [feedbackSchema]
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
