import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import NavbarPage from "./NavbarPage";
import './Styles/Result.css'

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function Results() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch("https://realtimepollingsystem-1.onrender.com/api/polls/all");
      const data = await response.json();
      if (data.polls) {
        setPolls(data.polls);
      } else {
        console.error("No polls found");
      }
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

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
              <h3  style={{color:"blue",fontSize:'24px'}}>{poll.title}</h3>
              {poll.createdBy?.email && (
             <p className="creator-email">Created by: {poll.createdBy.email}</p>
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
