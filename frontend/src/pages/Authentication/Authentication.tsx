// Authentication.js
import React, { useState } from "react";
import SignUpPage from "./SignUpPage";
import SignInPage from "./SignInPage";
import "./Authentication.css";
import { Navigate } from "react-router-dom";

const Authentication: React.FC = () => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const isUserLoggedIn = !!localStorage.getItem('user');

    const toggleAuthenticationMode = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setIsSignIn((prevMode) => !prevMode);
            setIsTransitioning(false);
        }, 500);
    };

    if (isUserLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className={`authentication-container ${isTransitioning ? "hidden" : ""}`}>
            {isSignIn ? (
                <SignInPage toggleAuthenticationMode={toggleAuthenticationMode} />
            ) : (
                <SignUpPage toggleAuthenticationMode={toggleAuthenticationMode} />
            )}
        </div>
    );
};

export default Authentication;