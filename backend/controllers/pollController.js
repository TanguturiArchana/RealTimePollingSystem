// controllers/pollController.js
const mongoose = require('mongoose');

const Poll = require('../models/Poll');
const User = require('../models/User');  // Ensure the User model is imported

exports.createPoll = async (req, res) => {
  const { title, options, duration } = req.body;
  const userId = req.user._id;  // userId from authenticated user, passed via token

  if (!title || !options || options.length < 2) {
    return res.status(400).json({ message: "Poll must have a title and at least two options." });
  }

  try {
    const pollOptions = options.map(opt => ({ text: opt }));

    // Parse the duration to calculate the poll end time
    const endTime = new Date(Date.now() + parseDuration(duration)); // This ensures we store a Date object for duration

    const poll = new Poll({
      title,
      options: pollOptions,
      duration: endTime,
      createdBy: userId, // Directly assign userId
    });

    await poll.save();

    // Update user's created polls
    const user = await User.findById(userId);  // Ensure this line is correct
    if (user) {
      user.createdPolls.push(poll._id); // Ensure user's createdPolls is updated
      await user.save();
    }

    res.status(201).json({ message: "Poll created successfully", poll });
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ message: "Error creating poll" });
  }
};

exports.votePoll = async (req, res) => {
  const { pollId, optionId } = req.body; // Expecting a single optionId
  const userId = req.user._id;

  console.log('pollId:', pollId);  // Debugging
  console.log('optionId:', optionId);  // Debugging

  // Check if both pollId and optionId are provided
  if (!pollId || !optionId) {
    return res.status(400).json({ message: 'Poll ID and Option ID are required' });
  }

  try {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    const hasVoted = poll.votedBy.some(vote => {
      const voteUserId = vote.user?._id || vote.user; // handle populated vs raw ID
      return voteUserId?.toString() === userId.toString();
    });
    if (hasVoted) {
      return res.status(400).json({ message: "You have already voted on this poll." });
    }

    // Log the available options in the poll for debugging
    console.log('Poll options:', poll.options);

    // Ensure optionId is valid
    const option = poll.options.find(o => o._id.toString() === new mongoose.Types.ObjectId(optionId).toString());
    if (!option) {
      return res.status(404).json({ message: `Option with ID ${optionId} not found` });
    }

    // Increment the vote count for the selected option
    option.votes += 1;
    // Add the user's vote to the votedBy array (store the selected option's ID)
    poll.votedBy.push({
      user: userId,
      option: optionId, // Store the selected option's ID as a string
    });

    await poll.save(); // Save the updated poll

    res.status(200).json({ message: "Vote recorded", poll });
  } catch (err) {
    console.error("Error voting:", err);
    res.status(500).json({ message: 'Error voting' });
  }
};

// Helper function to parse duration like "01:00" to ms
function parseDuration(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return ((hours * 60) + minutes) * 60 * 1000;
}
exports.getPolls = async (req, res) => {
  try {
    const userId = req.user._id; // Get the logged-in user's ID
    const now = new Date();

    // Polls created by the logged-in user
    const createdPollsRaw = await Poll.find({ createdBy: userId }).populate('createdBy', 'email');
    const createdPolls = createdPollsRaw.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      return {
        ...poll.toObject(),
        totalVotes,
        status: new Date(poll.duration) > now ? "Active" : "Expired",
      };
    });

    // Polls where the user has voted
    const votedPollsRaw = await Poll.find({ 'votedBy.user': userId }).populate('createdBy', 'email');
    const votedPolls = votedPollsRaw.map((poll) => {
      const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
      return {
        ...poll.toObject(),
        totalVotes,
        status: new Date(poll.duration) > now ? "Active" : "Expired",
      };
    });
    //total votes
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
    res.status(200).json({ polls }); // ✅ wrap in an object
  } catch (err) {
    console.error('Error fetching polls:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





