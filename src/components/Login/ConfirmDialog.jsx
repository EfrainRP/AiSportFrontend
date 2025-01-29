import * as React from 'react';
import {
    Dialog,
    DialogTitle, 
    DialogActions,
    DialogContent,
    DialogContentText,
    Button
} from '@mui/material';


export default function ConfirmDialog({open = false, handleClose, handleConfirm, messageTitle = 'Are you sure to delete?', message=null}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                {messageTitle}
            </DialogTitle>

            {message &&
                <DialogContent>
                    <DialogContentText >
                        {message}
                    </DialogContentText>
                </DialogContent>
            }
            <DialogActions>
                <Button onClick={handleClose} autoFocus>Cancel</Button>
                <Button onClick={handleConfirm}> Confirm </Button>
            </DialogActions>
        </Dialog>
    );
}
