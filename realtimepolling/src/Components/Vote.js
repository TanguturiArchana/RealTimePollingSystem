import React, { useState, useEffect } from "react";
import NavbarPage from "./NavbarPage";
import SearchBar from "./SearchBar";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import './Styles/Createpoll.css';
import PopUp from "./PopUp";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function Vote() {
  const [polls, setPolls] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [votedPolls, setVotedPolls] = useState(new Set());

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://realtimepollingsystembackend.onrender.com/api/polls/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.polls) {
        const sortedPolls = data.polls.sort((a, b) => {
          if (a.status === 'Expired' && b.status !== 'Expired') return 1;
          if (a.status !== 'Expired' && b.status === 'Expired') return -1;

          return a.countdown - b.countdown;
        });

        setPolls(sortedPolls);
        const votedPollsSet = new Set(sortedPolls.filter(poll => poll.hasVoted).map(poll => poll._id));
        setVotedPolls(votedPollsSet);
      } else {
        console.error("No polls found");
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClicked(false);
    setSelectedOptions({});
    fetchPolls(); 
  };

  const handleOptionChange = (pollId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [pollId]: optionId,
    });
    setClicked(true);
  };

  const handleVote = async (pollId) => {
  if (!selectedOptions[pollId]) {
    alert("Please select an option before voting.");
    return;
  }

  const voteData = {
    pollId,
    optionId: selectedOptions[pollId],
  };

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("https://realtimepollingsystembackend.onrender.com/api/polls/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(voteData),
    });

    const data = await response.json();
    if (response.status === 200) {
      setVotedPolls(prev => new Set(prev).add(pollId)); 
      fetchPolls(); 
    } else {
      alert(data.message || "Error voting");
    }
  } catch (err) {
    console.error("Error sending vote data:", err);
    alert("There was an issue with submitting your vote. Please try again later.");
  }
};


  const formatTime = (milliseconds) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
    const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="maincont">
      <NavbarPage />
      <SearchBar />
      <div className="form-container main">
        <h1>Vote on Polls</h1>
        {polls.length === 0 ? (
          <p>No polls available to vote on.</p>
        ) : (
          polls.map((poll) => {
            const showGraph = (poll.status === "Expired") || poll.hasVoted || votedPolls.has(poll._id);

            const isExpired = poll.status === "Expired";

            return (
              <div className="inside" key={poll._id}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleVote(poll._id);
                  }}
                >
                  <div className="form-title">
                    <h3 style={{ color: "blue", fontSize: "24px" }}>{poll.title}</h3>
                  </div>

                  <div className="form-group">
                    {poll.status === "Active" && (
                      <p style={{ color: "red" }}>
                        Time Remaining: {formatTime(poll.countdown)}
                      </p>
                    )}

                    {showGraph && (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={poll.options.map((opt) => ({
                                name: opt.text,
                                value: opt.votes,
                              }))}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={100}
                              fill="#8884d8"
                              label
                            >
                              {poll.options.map((_, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                        {isExpired && <p style={{ color: "gray" }}>Poll Expired</p>}
                      </>
                    )}
                    {!showGraph && !isExpired && poll.options.map((option) => (
                      <div key={option._id}>
                        <input
                          type="radio"
                          id={`option-${poll._id}-${option._id}`}
                          name={`option-${poll._id}`}
                          value={option._id}
                          checked={selectedOptions[poll._id] === option._id}
                          onChange={() => handleOptionChange(poll._id, option._id)}
                        />
                        <label htmlFor={`option-${poll._id}-${option._id}`} style={{ marginLeft: "3px" }}>
                          {option.text}
                        </label>
                      </div>
                    ))}

                    {!isExpired && !showGraph && (
                      <button className="but" onClick={() => setModalOpen(true)} type="submit">
                        Vote
                      </button>
                    )}
                  </div>
                </form>

                {clicked && <PopUp show={modalOpen} handleClose={handleCloseModal} text="You have voted successfully!" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Vote;
