import React, { useState } from 'react';
import { SiGmail } from "react-icons/si";
import { FaLock } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Styles/Login.css';
// import { useAuth } from './context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // const { login } = useAuth();

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                // login();
                alert("Login successful!");
                navigate('/dashboard'); 
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error logging in");
        }
    };

    return (
        <div className='maincont'>
            <div>
                <h1 className='mainheading'>LOGIN</h1>
                <div className='innerinputcont'>
                    <div className='innerformcont'>
                        <div className='input'>
                            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div><SiGmail size={40} /></div>
                    </div>
                    <div className='innerformcont'>
                        <div className='input'>
                            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div><FaLock size={40} /></div>
                    </div>

                    <div className='inblw'>
                        <div><input type='checkbox' /></div>
                        <div><p className='textleft'>Remember me</p></div>
                        <p className='textright'>Forget password?</p>
                    </div>

                    <div className='innerformcont'>
                        <FaInstagram size={30} style={{ margin: '5px' }} />
                        <FaFacebook size={30} style={{ margin: '5px' }} />
                        <FaTwitter size={30} style={{ margin: '5px' }} />
                        <FaLinkedin size={30} style={{ margin: '5px' }} />
                        <FcGoogle size={30} style={{ margin: '5px' }} />
                    </div>

                    <button className='login' onClick={handleLogin}>LOGIN</button>

                    <div className='inblw'>
                        <p className='textleft'>Don't have an account?</p>
                        <p className='textright'><Link to='/signup'>Signup</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;