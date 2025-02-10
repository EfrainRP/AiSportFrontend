import * as React from 'react';
import {
    IconButton,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';


export default function BackButton() {
    const navigate = useNavigate();
    
    return (
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon/></IconButton>
    );
}

