import React from 'react';
import { Link } from 'react-router-dom';

function Nav (){
return (
    <nav>
        <ul>
        <li>
            <Link to="/">SportHub</Link>
        </li>
        <li>
            <Link to="/signin">Sign In</Link>
        </li>
        <li>
            <Link to="/signup">Sign up</Link>
        </li>
        <li>
            <Link to="/dashboard">Dashboard</Link>
        </li>
        </ul>
    </nav>
    )
}
export default Nav;