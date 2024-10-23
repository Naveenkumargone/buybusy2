import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../index';

const useAuth = () => {
    const [currentUser, setcurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setcurrentUser(user);
        })

        return () => unsubscribe();

    }, []);

    return {currentUser};
}

export default useAuth