import React from 'react';
import "./styles/Navbar.css";
import { TfiExport } from "react-icons/tfi"
import Logo from "../assets/images/agile-teknik-h50px.png"

function Navbar() {
    return (
        <div className='nav-wrapper'>
            <div className="nav-container">
                <img src={Logo} alt="" className='nav-logo' />
                {/* <h2 className='nav-title'>Agile Teknik</h2> */}
                <div className='nav-line'>|</div>
                <h3 className='nav-description'>Mind Map</h3>
                {/* <div className='nav-line'>|</div>
                <TfiExport className='nav-description' /> */}
            </div>
        </div>
    )
}

export default Navbar