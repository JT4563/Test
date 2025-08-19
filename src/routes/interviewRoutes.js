
const express = require('express');
const { body, param } = require('express-validator');
const { auth, requireRole } = require('../middleware/authMiddleware');
const {
  createInterview,
  getInterviews,
  getMyInterviews,
  bookInterview,
  submitAnswers
} = require('../controllers/interviewController');

const router = express.Router();

// 3. HR/Admin Creates Interview Slot
router.post('/interviews', auth, requireRole('hr', 'admin'), [
  body('title').isString().isLength({ min: 3 }),
  body('date').isISO8601()
], createInterview);

// 5a. Get All Interviews (HR/Admin view also for simple demo)
router.get('/interviews', auth, getInterviews);

// 5b. Candidate's booked interviews
router.get('/my-interviews', auth, getMyInterviews);

// 4. Candidate Books Interview
router.post('/interviews/:id/book', auth, [
  param('id').isMongoId()
], bookInterview);

// 6. Submit Candidate Answers
router.post('/interviews/:id/answers', auth, [
  param('id').isMongoId(),
  body('answers').isArray().custom(arr => arr.every(a => typeof a.question === 'string' && typeof a.answer === 'string'))
], submitAnswers);

module.exports = router;
