// import React from 'react';
// import { Table, Button } from 'react-bootstrap';
// import { FaEye,FaPlus } from 'react-icons/fa';
// import './Styles/UserTabel.css';
// import { useNavigate } from 'react-router-dom'; 
// function UserCustomTable({ polls = [] }) {
//    const navigate = useNavigate();
//   return (
//     <div className="dashboard-container">
//       <div className="polls-box">
//         <h5>My Voted Polls</h5>
//         <Table bordered responsive className="polls-table">
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Status</th>
//               <th>Votes</th>
//               <th>View</th>

//             </tr>
//           </thead>
//           <tbody>
//             {polls.map((poll) => (
//               <tr key={poll._id}>
//                 <td>{poll.title}</td>
//                 <td>{poll.status}</td>
//                 <td>{poll.totalVotes}</td>
//                 <td><FaEye className="action-icon view" /></td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>

//         <Button className="create-button" onClick={() => navigate('/vote')}>
//           <FaPlus style={{ marginRight: '5px' }} />
//           Vote New Poll
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default UserCustomTable;
import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { FaEye, FaPlus } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Styles/UserTabel.css';
import { useNavigate } from 'react-router-dom';

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

function UserCustomTable({ polls = [] }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);

  const handleView = (poll) => {
    setSelectedPoll(poll);
    setShowModal(true);
  };

  const handleClose = () => {
    setSelectedPoll(null);
    setShowModal(false);
  };

  return (
    <div className="dashboard-container">
      <div className="polls-box">
        <h5>My Voted Polls</h5>
        <Table bordered responsive className="polls-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Votes</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {polls.map((poll) => (
              <tr key={poll._id}>
                <td>{poll.title}</td>
                <td>{poll.status}</td>
                <td>{poll.totalVotes}</td>
                <td>
                  <FaEye className="action-icon view" onClick={() => handleView(poll)} style={{ cursor: 'pointer' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Button className="create-button" onClick={() => navigate('/vote')}>
          <FaPlus style={{ marginRight: '5px' }} />
          Vote New Poll
        </Button>
      </div>

      {/* Modal for Pie Chart */}
      <Modal show={showModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPoll?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPoll && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={selectedPoll.options.map((opt) => ({
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
                  {selectedPoll.options.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default UserCustomTable;