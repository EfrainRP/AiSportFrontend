import * as React from 'react';
import {
    IconButton,
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate } from 'react-router-dom';


export default function BackButton({url=-1}) {
    const navigate = useNavigate();
    
    return (
        <IconButton onClick={() => navigate(url)}><ArrowBackIcon/></IconButton>
    );
}

