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
            {/* <Link to="/Login">Sign in</Link> */}
        </li>
        {/* <li>
            <Link to="/products">Products</Link>
        </li> */}
        </ul>
    </nav>
    )
}
export default Nav;