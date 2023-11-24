import { Button } from "@mui/material";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
    const isUserLoggedIn = !!localStorage.getItem('user');
    
    if (!isUserLoggedIn) {
        return <Navigate to="/auth" />;
    }

    return(
        <div>
            <Button onClick={()=>localStorage.clear()}>
                Log out
            </Button>
        </div>
    )
}

export default DashboardPage