import * as React from 'react';
import {
    Typography,
    CircularProgress,
    Card,
    CardContent,
} from '@mui/material';


export default function LoadingCard({ message = null, CircularSize = '5%'}) {
    return (
        <Card variant="outlined">
            <CardContent>
            <Typography gutterBottom variant="body1" component="div" sx={{display: 'flex', justifyContent:'center'}}>
                <CircularProgress size={CircularSize} color="inherit" sx={{mr:1}}/> Loading
            </Typography>
            {message && 
                <Typography gutterBottom variant="body2" component="div" sx={{display: 'flex', justifyContent:'center'}}>
                    {message} 
                </Typography>}
            </CardContent>
        </Card>
    );
}
