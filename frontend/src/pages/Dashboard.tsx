import { Navigate } from "react-router-dom";

const DashboardPage = () => {
    const isUserLoggedIn = !!localStorage.getItem('userData');
    
    if (!isUserLoggedIn) {
        return <Navigate to="/auth" />;
    }
    
    return <div>
        Hello WOrld
    </div>
}

export default DashboardPage