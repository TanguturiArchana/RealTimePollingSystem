const express = require('express');
const router = express.Router();
const { createPoll, votePoll, getPolls,getallPolls } = require('../controllers/pollController');
const authenticate = require('../middleware/authenticate');

// Route Definitions
router.post('/create', authenticate, createPoll);  // Requires authentication
router.post('/vote', authenticate, votePoll);  // Public route for voting
router.get('/',authenticate, getPolls);  // Public route to fetch polls
router.get('/all', getallPolls);

module.exports = router;
