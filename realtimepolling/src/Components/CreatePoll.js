import React, { useState } from "react";
import NavbarPage from "./NavbarPage";
import './Styles/Createpoll.css';
import PopUp from "./PopUp";

function CreatePoll() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pollTitle, setPollTitle] = useState('');
  const [options, setOptions] = useState({
    option1: '',
    option2: '',
    option3: '',
    option4: ''
  });
  const [duration, setDuration] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedOptions = Object.values(options).filter(opt => opt);

    if (selectedOptions.length < 2) {
      alert('Poll must have at least two options.');
      return;
    }

    const pollData = {
      title: pollTitle,
      options: selectedOptions,
      duration: duration, 
    };
    const token = localStorage.getItem('token'); 
    console.log('Token from localStorage:', token);  

    try {
      const response = await fetch('https://realtimepollingsystembackend.onrender.com/api/polls/create', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pollData),
      });

      const data = await response.json();
      if (response.status === 201) {
        setModalOpen(true); 
      } else {
        alert(data.message || 'Error creating poll');
      }
    } catch (err) {
      console.error('Error sending poll data:', err);
      alert('Error creating poll');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setPollTitle('');
    setOptions({
      option1: '',
      option2: '',
      option3: '',
      option4: ''
    });
    setDuration('');
  };

  return (
    <div className="maincont">
      <NavbarPage />
      <div className="form-container">
        <h1>Poll Creation Form</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-title">
            <label htmlFor="pollTitle" style={{color:"blue"}}>Poll Title</label>
            <input
              type="text"
              id="pollTitle"
              name="pollTitle"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label  style={{color:"blue"}}>Options</label>
            <div className="form-options">
              {Object.keys(options).map((key, index) => (
                <div key={index}>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={options[key]}
                    onChange={(e) => setOptions({ ...options, [key]: e.target.value })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration"  style={{color:"blue"}}>Set Poll Duration</label>
            <input
              type="time"
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <button className="but" type="submit">Create Poll</button>
        </form>
        <PopUp show={modalOpen} handleClose={handleCloseModal} text="Your poll has been successfully created!" />
      </div>
    </div>
  );
}

export default CreatePoll;
