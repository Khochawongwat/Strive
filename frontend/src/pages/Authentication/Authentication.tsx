// Authentication.js
import React, { useEffect, useState } from "react";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import "./Authentication.css";
import { Alert, Box, Snackbar, SnackbarOrigin } from "@mui/material";
import { Navigate} from "react-router-dom";
import { User } from "@firebase/auth";
import { firebaseAuth } from "../../services/auth.service";

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
    })
    const {vertical, horizontal, open, message} = snackState
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

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
        const handleAuthStateChanged = async (user: User | null) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    console.log("AuthPage: User found. Navigating to Dashboard");
                    setToken(token)
                } catch (error: any) {
                    console.error('Error getting user token:', error.message);
                }
            } else {
                console.log("No user signed in.");
            }
            setSuccess(true)
            setLoading(false)
        };

        const unsubscribe = firebaseAuth.onAuthStateChanged(handleAuthStateChanged);

        return () => {
            unsubscribe()
        };

    }, [token]);

    const shouldRedirect = token.length > 0 && success && !loading

    if (shouldRedirect) {
        return <Navigate to="/" />
    }

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