import React, { useEffect, useState } from "react";
import NavbarPage from "./NavbarPage";
import UserTable from "./UserTable";
import UserCustomTable from './UserCustomTable';

function Dashboard() {
  const [createdPolls, setCreatedPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [totalPolls, setTotalPolls] = useState(0);
  const [totalPolledVotes, settotalPolledVotes] = useState([]);
  
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/polls", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCreatedPolls(data.createdPolls);  
        setVotedPolls(data.votedPolls);    
        setTotalPolls(data.totalPolls);
        settotalPolledVotes(data.totalPolledVoted);

       
        
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div>
      <NavbarPage />
      <UserTable createdPolls={createdPolls} votedPolls={votedPolls} totalVotes={totalPolls} totalPolledVotes={totalPolledVotes} />
      <UserCustomTable polls={votedPolls} />
    </div>
  );
}

export default Dashboard;
