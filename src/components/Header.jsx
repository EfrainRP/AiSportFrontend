import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
return (
    <header>
        <Link to="/"><h2 className="logo">Sporthub</h2></Link>
        <div className="container">
        <nav>
            <Link to="/signin">Sign In</Link>
            <Link to="/signup">Sign up</Link>
        </nav>
        </div>
    </header>
    );
}