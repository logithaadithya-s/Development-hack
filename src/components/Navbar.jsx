import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../Styles/Navbar.css"
const subjects=[{SubjectName:"CALCULUS"}];
function Navbar(){
    return (
    <>
    <header className="vitgpt-header">
        <nav className="vitgpt-navbar">
            <div className="navbar-container">
                <input list="subject" placeholder="Search..." className="subject-input "/>
                <datalist id="subject">
                    {subjects.map((element,index) =>{
                        return <option key={index} value={element.SubjectName} className="options"/>;
                    })}        
                </datalist>
            <button className="upload-button">UPLOAD</button>
            </div>
        </nav>
    </header>
    </>
    );
}
export default Navbar