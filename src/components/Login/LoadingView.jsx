import * as React from 'react';
import {
    Typography,
    Backdrop,
    CircularProgress,
} from '@mui/material';

import LayoutLogin from '../../views/LayoutLogin';

export default function LoadingView({ message = null}) {
    return (
        <LayoutLogin>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer - 1, display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center', flexDirection: 'column'})} open
            >
                <CircularProgress color="inherit" />
                <Typography variant='h6' sx={{ mt: 3 }}>
                    {`Loading...`}
                </Typography>
                {message && 
                <Typography variant='h6' sx={{ mt: 3 }}>
                    {message}
                </Typography>}
            </Backdrop>
        </LayoutLogin>
    );
}
