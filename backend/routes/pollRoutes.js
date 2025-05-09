const express = require('express');
const router = express.Router();
const { createPoll, votePoll,getPolls,getallPolls } = require('../controllers/pollController');
const authenticate = require('../middleware/authenticate');


router.post('/create', authenticate, createPoll); 
router.post('/vote', authenticate, votePoll);  
router.get('/',authenticate, getPolls); 
router.get('/all',authenticate, getallPolls);
router.get('/public/all', getallPolls); 


module.exports = router;
