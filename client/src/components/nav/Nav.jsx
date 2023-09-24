import "./nav.css";
import React from 'react';
import { Link, useNavigate } from "react-router-dom";


const Nav = () => {
const navigate = useNavigate();

return (
<>
{/* part of the reponsive hamburger nav menu */}
<input id="menu-toggle" type="checkbox" />
<label className='menu-button-container' htmlFor="menu-toggle"><div className='menu-button'></div></label>

<nav className="menu">
<ul>
<li><Link to="/">Home</Link></li>
<li><Link to="/dashboard">Dashboard</Link></li>
<li><Link to="/map">Zombie Sightings</Link></li>

<li>Login/Signup (if not logged in), Logout(if Logged In)</li>

</ul>
</nav>
    
</>
  )
}

export default Nav