import { Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../index";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <div>Loading...</div>;  // Optional: you can add a loading spinner here
    }

    return user ? (
        <Component {...rest} />
    ) : (
        <Navigate to="/signin" />
    );
};

export default ProtectedRoute;
