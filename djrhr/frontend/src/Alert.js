import React, {useState, useEffect, useContext} from 'react';
import { ContextLibrary } from '.';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/core/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';
import { Container } from '@material-ui/core';

export default function TransitionAlert() {
    const globalState = useContext(ContextLibrary);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("info");

    useEffect(()=>{
        setMessage(globalState.data.alert.message);
        setSeverity(globalState.data.alert.severity);
        setOpen(globalState.data.alert.showAlert);
        
    }, [globalState.data.alert.showAlert]);

    return (
        <Container maxWidth="xs">
            <Box sx={{ width: '100%' }}>
                <Collapse in={open}>
                    <Alert
                    variant="outlined"
                    severity={severity} ///string=error||warning||info||success
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            globalState.toggleAlert();
                        }}
                        >
                        <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                    >
                    {message}
                    </Alert>
                </Collapse>
            </Box>
        </Container>
    );
};