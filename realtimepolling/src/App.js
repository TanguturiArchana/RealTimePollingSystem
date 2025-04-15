import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup'; 
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import Vote from './Components/Vote';
import Results from './Components/Results';
import CreatePoll from './Components/CreatePoll';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<Results/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/vote" element={<Vote />} />
       
      </Routes>
    </Router>
  );
}

export default App;
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './Components/Login';
// import Signup from './Components/Signup'; 
// import Home from './Components/Home';
// import Dashboard from './Components/Dashboard';
// import Vote from './Components/Vote';
// import Results from './Components/Results';
// import CreatePoll from './Components/CreatePoll';


// import { AuthProvider } from './Components/context/AuthContext';

// function App() {
//   return (
//     <AuthProvider>
//       <Router> {/* Use Router (BrowserRouter) here */}

//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/results" element={<Results />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/create" element={<CreatePoll />} />
//           <Route path="/vote" element={<Vote />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
