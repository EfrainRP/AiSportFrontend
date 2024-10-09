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
            <Link to="/SignIn">Sign In</Link>
        </li>
        <li>
            <Link to="/SignUp">Sign up</Link>
        </li>
        </ul>
    </nav>
    )
}
export default Nav;