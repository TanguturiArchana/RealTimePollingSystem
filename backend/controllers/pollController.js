
const mongoose = require('mongoose');

const Poll = require('../models/Poll');
const User = require('../models/User');  

exports.createPoll = async (req, res) => {
  const { title, options, duration } = req.body;
  const userId = req.user._id; 

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ message: "Poll must have a title and at least two options." });
  }

  try {
    const pollOptions = options.map(opt => ({ text: opt }));
    const endTime = new Date(Date.now() + parseDuration(duration)); 

    const poll = new Poll({
      title,
      options: pollOptions,
      duration: endTime,
      createdBy: userId, 
    });

    await poll.save();
    const user = await User.findById(userId);  
    if (user) {
      user.createdPolls.push(poll._id); 
      await user.save();
    }

    res.status(201).json({ message: "Poll created successfully", poll });
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ message: "Error creating poll" });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionId } = req.body; 
  const userId = req.user._id;

  console.log('pollId:', pollId);
  console.log('optionId:', optionId); 
  if (!pollId || !optionId) {
    return res.status(400).json({ message: 'Poll ID and Option ID are required' });
  }

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const hasVoted = poll.votedBy.some(vote => {
      const voteUserId = vote.user?._id || vote.user; 
      return voteUserId?.toString() === userId.toString();
    });
    if (hasVoted) {
      return res.status(400).json({ message: "You have already voted on this poll." });
    }

    console.log('Poll options:', poll.options);

    const option = poll.options.find(o => o._id.toString() === new mongoose.Types.ObjectId(optionId).toString());
    if (!option) {
      return res.status(404).json({ message: `Option with ID ${optionId} not found` });
    }
    option.votes += 1;
    poll.votedBy.push({
      user: userId,
      option: optionId,
    });

    await poll.save();

    res.status(200).json({ message: "Vote recorded", poll });
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).json({ message: 'Error voting' });
  }
};


function parseDuration(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return ((hours * 60) + minutes) * 60 * 1000;
}
exports.getPolls = async (req, res) => {
  try {
    const userId = req.user._id; 
    const now = new Date();
    const createdPollsRaw = await Poll.find({ createdBy: userId }).populate('createdBy', 'email');
    const createdPolls = createdPollsRaw.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      return {
        ...poll.toObject(),
        totalVotes,
        status: new Date(poll.duration) > now ? "Active" : "Expired",
      };
    });
    const votedPollsRaw = await Poll.find({ 'votedBy.user': userId }).populate('createdBy', 'email');
    const votedPolls = votedPollsRaw.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      return {
        ...poll.toObject(),
        totalVotes,
        status: new Date(poll.duration) > now ? "Active" : "Expired",
      };
    });

    const polls = await Poll.find();
    let totalPolledVoted = 0;
    polls.forEach(poll => {
      totalPolledVoted  += poll.votedBy.length;
    });
    let totalPolls=polls.length;


    res.status(200).json({ createdPolls, votedPolls,totalPolls,totalPolledVoted });
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getallPolls = async (req, res) => {
  try {
    const polls = await Poll.find().populate('createdBy', 'email');
    res.status(200).json({ polls });
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





