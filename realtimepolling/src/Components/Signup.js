import React, { useState } from 'react';
import { SiGmail } from "react-icons/si";
import { FaLock } from "react-icons/fa";
import { MdLock } from 'react-icons/md';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Styles/Login.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("https://realtimepollingsystembackend.onrender.com/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, confirmPassword })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token); 
                alert("Signup successful!");
                navigate('/login');
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error during signup");
        }
    };

    return (
        <div className='maincont'>
            <div>
                <h1 className='mainheading'>SIGNUP</h1>
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
                    <div className='innerformcont'>
                        <div className='input'>
                            <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        <div><MdLock size={40} /></div>
                    </div>

                    <div className='innerformcont'>
                        <FaInstagram size={30} style={{ margin: '5px' }} />
                        <FaFacebook size={30} style={{ margin: '5px' }} />
                        <FaTwitter size={30} style={{ margin: '5px' }} />
                        <FaLinkedin size={30} style={{ margin: '5px' }} />
                        <FcGoogle size={30} style={{ margin: '5px' }} />
                    </div>

                    <button className='login' onClick={handleSignup}>SIGNUP</button>

                    <div className='inblw'>
                        <p className='textleft'>Do you already have an account?</p>
                        <p className='textright'><Link to='/login'>Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
