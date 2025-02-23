import * as React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, 
    IconButton,
    Button,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
    //     backgroundRepeat: 'no-repeat',
    //         backgroundImage:
    //         'radial-gradient(ellipse at 50% 50%, hsla(0, 0.00%, 100.00%, 0.84), hsla(28, 65.40%, 79.60%, 0.91))',
    //         ...theme.applyStyles('dark', {
    //           backgroundImage:
    //           'radial-gradient(at 50% 50%, hsla(29, 97.00%, 26.50%, 0.75), hsla(27, 64.80%, 17.80%, 0.64))', 
    //           }),
    backgroundColor:theme.palette.background.default,
    },
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function DialogComponent({modalTittle, modalBody, open, handleClose}) {
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {modalTittle}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                {modalBody}
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose} variant='contained' color='secondary'>
                    Close
                </Button>
            </DialogActions>
            </BootstrapDialog>
        );
}

