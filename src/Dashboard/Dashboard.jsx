import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
    async function getUser() {
        try {
            const response = await axios.get('/user?ID=12345');
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            holadd
        </div>
    )
}
export default Dashboard;