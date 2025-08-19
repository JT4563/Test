
const { validationResult } = require('express-validator');
const Interview = require('../models/Interview');

exports.addFeedback = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { candidateId, rating, feedback } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    interview.feedbacks.push({ candidate: candidateId, rating, feedback });
    await interview.save();
    res.json({ message: 'Feedback recorded' });
  } catch (e) { next(e); }
};

exports.leaderboard = async (req, res, next) => {
  try {
    // Aggregate latest score per candidate across interviews and average rating
    const docs = await Interview.aggregate([
      { $unwind: { path: "$answers", preserveNullAndEmptyArrays: false } },
      { $group: {
          _id: "$answers.candidate",
          totalScore: { $sum: "$answers.score" },
          interviews: { $sum: 1 }
      }},
      { $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
      }},
      { $unwind: "$user" },
      { $project: {
          candidateId: "$_id",
          name: "$user.name",
          email: "$user.email",
          totalScore: 1,
          interviews: 1
      }},
      { $sort: { totalScore: -1 } }
    ]);
    res.json(docs);
  } catch (e) { next(e); }
};
