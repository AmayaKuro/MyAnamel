"use client";
import { useState, useEffect, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { useAlert } from "@/utils/providers/alert";


const AlertPopUp: React.FC = () => {
    const [open, setOpen] = useState(false);
    
    const { state: { alertMessage, severity } } = useAlert();

    useEffect(() => {
        if (alertMessage !== "") {
            setOpen(true);
        }
    }, [alertMessage]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <MuiAlert
                elevation={6}
                variant="filled"
                sx={{ width: '100%' }}
                severity={severity}
                onClose={handleClose}
            >
                {alertMessage}
            </MuiAlert>
        </Snackbar >
    );
}

export default AlertPopUp;