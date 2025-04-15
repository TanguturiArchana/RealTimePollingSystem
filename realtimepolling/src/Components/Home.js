import React from "react";
import NavbarPage from "./NavbarPage";
import './Styles/Home.css'
import { useNavigate } from 'react-router-dom'; 

function Home(){
    const navigate = useNavigate();
    return(
        <div className='maincont'>
            <NavbarPage/>
            <div>
                <h1 className="head">Welcome to Real-Time Polling Platform!!</h1>
                <p className="para">Join the conversation by voting in active polls and watching results change live!  Want to ask your own questions? Easily create custom polls and share them with others. Log in now to get started!</p>
                <button className="but" onClick={() => navigate('/login')}>Vote active polls</button>
                <button className="but" onClick={() => navigate('/login')}>Create new poll</button>
            </div>
        </div>
    );
}
export default Home;