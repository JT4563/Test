
const { validationResult } = require('express-validator');
const Interview = require('../models/Interview');

exports.createInterview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title, date } = req.body;
    const interview = await Interview.create({
      title,
      date: new Date(date),
      createdBy: req.user.id,
      status: 'open'
    });
    res.status(201).json(interview);
  } catch (e) { next(e); }
};

exports.getInterviews = async (req, res, next) => {
  try {
    const list = await Interview.find().populate('bookedBy', 'name email').sort({ date: 1 });
    res.json(list);
  } catch (e) { next(e); }
};

exports.getMyInterviews = async (req, res, next) => {
  try {
    const list = await Interview.find({ bookedBy: req.user.id }).sort({ date: 1 });
    res.json(list);
  } catch (e) { next(e); }
};

exports.bookInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    if (interview.status !== 'open') return res.status(400).json({ error: 'Interview not open' });
    interview.status = 'booked';
    interview.bookedBy = req.user.id;
    await interview.save();
    res.json({ message: 'Interview booked', interviewId: interview._id });
  } catch (e) { next(e); }
};

exports.submitAnswers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { answers } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    if (String(interview.bookedBy) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Not your interview' });
    }
    // naive scoring: +1 per non-empty answer
    const score = (answers || []).reduce((acc, a) => acc + (a.answer?.trim() ? 1 : 0), 0);
    interview.answers.push({ candidate: req.user.id, answers, score });
    interview.status = 'completed';
    await interview.save();
    res.json({ message: 'Answers submitted', score });
  } catch (e) { next(e); }
};
