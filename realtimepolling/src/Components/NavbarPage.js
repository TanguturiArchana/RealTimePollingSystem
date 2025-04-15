import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink,useLocation } from 'react-router-dom';
import { FaPoll } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
function NavbarPage() {
  const location = useLocation();
  const navigate = useNavigate();

  
  return (
    <Navbar style={{ backgroundColor: '#d3a4ff' }} expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" style={{ fontWeight: 'bold' }}>
          <FaPoll style={{ marginRight: '5px' }} />
          POLL
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          {location.pathname === '/' && <Nav.Link
              as={NavLink}
              to="/"
              style={({ isActive }) => ({
                color: isActive ? '#E80C88' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Home
            </Nav.Link>}

            <Nav.Link
              as={NavLink}
              to="/dashboard"
              style={({ isActive }) => ({
                color: isActive ? '#E80C88' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Dashboard
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/create"
              style={({ isActive }) => ({
                color: isActive ? '#E80C88' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Create Poll
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/vote"
              style={({ isActive }) => ({
                color: isActive ? '#E80C88' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Vote
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to="/results"
              style={({ isActive }) => ({
                color: isActive ? '#E80C88' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Results
            </Nav.Link>

            {location.pathname !== '/' ? (
              <NavDropdown title={<FaUser style={{ fontSize: '18px' }} />} id="basic-nav-dropdown">
                <NavDropdown.Item href="#logout" onClick={() => navigate('/login')}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (

              <NavLink to="/login"  style={{ backgroundColor: ' #8F87F1', color: 'white', borderRadius: "20px", padding: "5px",height:"35px",width:"70px", textAlign: 'center' }}>
                Login
              </NavLink>
              
            )}
          </Nav>
        
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPage;
