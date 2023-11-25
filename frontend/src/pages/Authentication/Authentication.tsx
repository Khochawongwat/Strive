// Authentication.js
import React, { useEffect, useState } from "react";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import "./Authentication.css";
import { Alert, Box, Snackbar, SnackbarOrigin } from "@mui/material";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { matchAPIErrorCode } from "../../utils/ErrorHandler";
interface State extends SnackbarOrigin {
    open: boolean
    message: String
}

const Authentication: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [snackState, setSnackState] = useState<State>({
        open: false,
        message: "",
        vertical: 'top',
        horizontal: 'center',
    }
    )
    const {vertical, horizontal, open, message} = snackState
    const [session, setSession] = useState(null);

    const handleOpen = (message: String) => {
        setSnackState({...snackState, open: true, message: message})
    }

    const handleClose = () => {
        setSnackState({...snackState, open: false})
    }

    const toggleAuthenticationMode = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsSignIn((prevMode) => !prevMode);
            setIsTransitioning(false);
        }, 500);
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get("http://localhost:3000/auth/retrieveSession")
                const session = response.data.session
                setSession(session)
            } catch (error: any) {
                handleOpen(matchAPIErrorCode(error))
                console.error('Error retrieving session:', matchAPIErrorCode(error));
            }
        };

        fetchSession();
    }, []);
    
    return (
        <Box className={`authentication-container ${isTransitioning ? "hidden" : ""}`}>
            <Snackbar
                autoHideDuration={3000}
                anchorOrigin={{vertical, horizontal}}
                open={open}
                onClose={handleClose}
                key = {vertical + horizontal}
            >
                <Alert onClose={handleClose} severity={message.includes("Error") ? "error" : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
            {isSignIn ? (
                <SignInPage toggleAuthenticationMode={toggleAuthenticationMode} notify = {handleOpen}/>
            ) : (
                <SignUpPage toggleAuthenticationMode={toggleAuthenticationMode} notify = {handleOpen} />
            )}
        </Box>
    );
};

export default Authentication;