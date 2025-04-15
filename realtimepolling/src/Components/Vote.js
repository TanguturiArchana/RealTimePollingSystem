// import React, { useState, useEffect } from "react";
// import NavbarPage from "./NavbarPage";
// import PopUp from "./PopUp";
// import SearchBar from "./SearchBar";

// function Vote() {
//   const [polls, setPolls] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState({}); // Initialize as an object

//   // Fetch polls from the backend when the component mounts
//   useEffect(() => {
//     fetchPolls();
//   }, []);

//   const fetchPolls = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/polls");
//       const data = await response.json();

//       if (data.polls) {
//         setPolls(data.polls);
//       } else {
//         console.error("No polls found");
//       }
//     } catch (err) {
//       console.error("Error fetching polls:", err);
//     }
//   };

//   // Handle voting - this function must be asynchronous
//   const handleVote = async (pollId) => {
//     // Ensure an option is selected for this poll
//     if (!selectedOptions[pollId]) {
//       alert("Please select an option before voting.");
//       return;
//     }

//     const voteData = {
//       pollId,
//       optionId: selectedOptions[pollId], // Send the selected option for this poll
//     };

//     console.log("Vote Data:", voteData);  // Debug log

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch("http://localhost:5000/api/polls/vote", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(voteData),
//       });

//       const data = await response.json();
//       if (response.status === 200) {
//         setModalOpen(true); // Show success message
//       } else {
//         alert(data.message || "Error voting");
//       }
//     } catch (err) {
//       console.error("Error sending vote data:", err);
//       alert("Error voting");
//     }
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedOptions({});
//     fetchPolls();
//   };

//   return (
//     <div className="maincont">
//       <NavbarPage />
//       <SearchBar />
//       <div className="form-container">
//         <h1>Vote on Polls</h1>
//         {polls.length === 0 ? (
//           <p>No polls available to vote on.</p>
//         ) : (
//           polls.map((poll) => (
//             <form
//               key={poll._id}
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleVote(poll._id); // Handle vote submission
//               }}
//             >
//               <div className="form-title">
//                 <h3>{poll.title}</h3>
//               </div>
//               <div className="form-group">
//                 {poll.options.map((option) => (
//                   <div key={option._id}>
//                     <input
//                       type="radio"
//                       id={`option-${poll._id}-${option._id}`}
//                       name={`option-${poll._id}`}
//                       value={option._id}
//                       checked={selectedOptions[poll._id] === option._id}
//                       onChange={() => {
//                         setSelectedOptions({
//                           ...selectedOptions,
//                           [poll._id]: option._id,
//                         });
//                       }}
//                     />
//                     <label htmlFor={`option-${poll._id}-${option._id}`}>
//                       {option.text}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//               <button className="but" type="submit">
//                 Vote
//               </button>
//             </form>
//           ))
//         )}
//         <PopUp
//           show={modalOpen}
//           handleClose={handleCloseModal}
//           text="You have voted successfully!"
//         />
//       </div>
//     </div>
//   );
// }

// export default Vote;





import React, { useState, useEffect } from "react";
import NavbarPage from "./NavbarPage";
import PopUp from "./PopUp";
import SearchBar from "./SearchBar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import './Styles/Createpoll.css'

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function Vote() {
  const [polls, setPolls] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [votedPollId, setVotedPollId] = useState(null); // NEW
  const [voted, setVoted] = useState(false); 

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/polls/all");
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
      const response = await fetch("http://localhost:5000/api/polls/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(voteData),
      });

      const data = await response.json();
      if (response.status === 200) {
        setModalOpen(true);
        setVotedPollId(pollId); // Set which poll was voted
      }
      else if (data.message === "You have already voted on this poll.") {
        setVoted(true);
        setModalOpen(true); // Show popup
        setVotedPollId(pollId); // Still show the graph!
      }  else {
        alert(data.message || "Error voting");
      }
    } catch (err) {
      console.error("Error sending vote data:", err);
      alert("Error voting");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOptions({});
    fetchPolls(); // To get updated vote counts
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
            const showGraph = votedPollId === poll._id;

            return (
              <form
                key={poll._id}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleVote(poll._id);
                }}
              >
                <div className="form-title">
                <h3>{poll.title}</h3>
                </div>

                <div className="form-group">
                  {showGraph ? (
                    // Show chart for the voted poll
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
                  ) : (
                    poll.options.map((option) => (
                      <div key={option._id}>
                        <input
                          type="radio"
                          id={`option-${poll._id}-${option._id}`}
                          name={`option-${poll._id}`}
                          value={option._id}
                          checked={selectedOptions[poll._id] === option._id}
                          onChange={() =>
                            setSelectedOptions({
                              ...selectedOptions,
                              [poll._id]: option._id,
                            })
                          }
                        />
                        <label htmlFor={`option-${poll._id}-${option._id}`}>
                          {option.text}
                        </label>
                      </div>
                    ))
                  )}
                </div>

                {!showGraph && (
                  <button className="but" type="submit">
                    Vote
                  </button>
                )}
              </form>
            );
          })
        )}
        <PopUp
          show={modalOpen}
          handleClose={handleCloseModal}
          text= {voted?"You have already voted on this poll.":"You have voted successfully!"}
        />
      </div>
    </div>
  );
}

export default Vote;