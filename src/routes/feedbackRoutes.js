
const express = require('express');
const { body, param } = require('express-validator');
const { auth, requireRole } = require('../middleware/authMiddleware');
const { addFeedback, leaderboard } = require('../controllers/feedbackController');

const router = express.Router();

// 7. HR Gives Feedback & Rating
router.post('/interviews/:id/feedback', auth, requireRole('hr', 'admin'), [
  param('id').isMongoId(),
  body('candidateId').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('feedback').optional().isString()
], addFeedback);

// 8. Leaderboard
router.get('/leaderboard', auth, leaderboard);

module.exports = router;
