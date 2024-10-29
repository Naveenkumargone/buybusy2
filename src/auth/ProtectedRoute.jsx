import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../index";
import { SpinnerLoader } from "../components/Loader";

const ProtectedRoute = ({ component: Component }) => {
    const [user, loading] = useAuthState(auth);

    if (loading) {
        return <SpinnerLoader />;
    }

    return user ? (
        <Component />
    ) : (
        <Navigate to="/signin" />
    );
};

export default ProtectedRoute;
