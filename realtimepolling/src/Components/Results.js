import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NavbarPage from "./NavbarPage";
import './Styles/Result.css'
import { Link, useNavigate } from 'react-router-dom';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function Results() {
  const [polls, setPolls] = useState([]);
  const [timer, setTimer] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPolls = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("https://realtimepollingsystembackend.onrender.com/api/polls/public/all", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        console.error("Unauthorized, please log in.");
        window.location.href = "/login";
        return;
      }

      const data = await response.json();
      if (data.polls) {
        const sortedPolls = data.polls.sort((a, b) => {
          if (a.status === 'Expired' && b.status !== 'Expired') return 1;
          if (a.status !== 'Expired' && b.status === 'Expired') return -1;
          return a.countdown - b.countdown;
        });

        setPolls(sortedPolls);
      } else {
        console.error("No polls found");
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.now();
    if (total <= 0) return "Expired";

    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const seconds = Math.floor((total / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // 

  return (
    <div className="result-container">
      <NavbarPage />
      <div className="form-container main">
        <h1>Poll Results</h1>
        {polls.length === 0 ? (
          <p>No polls available.</p>
        ) : (
          polls.map((poll) => (
            <div key={poll._id} className="poll-result">
              <h3 style={{ color: "blue", fontSize: '24px' }}>{poll.title}</h3>
              {poll.createdBy?.email && (
                <p className="creator-email">Created by: {poll.createdBy.email}</p>
              )}
              {poll.status === 'Expired' && (
                <p style={{ color: 'red' }}>This poll has expired</p>
              )}
              {poll.status === 'Active' && poll.endTime && (
                <p style={{ color: 'red' }}>
                  Time remaining: {getTimeRemaining(poll.endTime)}
                </p>
              )}
              {poll.hasVoted && (
                <p style={{ color: 'green' }}>You have already voted on this poll</p>
              )}
              {!poll.hasVoted && poll.status === "Active" && (
                <button >
                  <Link to='/vote'>Vote Now</Link>
                </button>
              )}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Results;
