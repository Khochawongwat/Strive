import axios from 'axios';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchSession = async () => {
            if (!loading) {
                setLoading(true)
                try {
                    const response = await axios.get("http://localhost:3000/auth/retrieveSession");
                    const session = response.data.session;
                    setSession(session);
                } catch (error: any) {
                    console.error('Error retrieving session:', error.message);
                }
                setLoading(false)
            }
        };

        fetchSession();
    }, []);

    if(!session){
        return <Navigate to="/auth"/>
    }

    return (
        <div>
            We're here!
        </div>
    )
}

export default DashboardPage