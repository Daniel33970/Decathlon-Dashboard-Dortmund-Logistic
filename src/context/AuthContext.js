import { browserSessionPersistence, onAuthStateChanged, setPersistence } from 'firebase/auth';
import { createContext, useEffect } from 'react';
import { auth } from '../firebase';
import { useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    // useEffect(() => {
    //     const unsub = onAuthStateChanged(auth, (user) => {
    //         setCurrentUser(user);
    //         console.log(user);
    //     });

    //     return () =>{
    //         unsub();

    //     }
    // }, []);

    useEffect(() => {
        const configurePersistence = async () => {
            try {
                // Setze die Auth-Persistenz auf Session-Basis
                await setPersistence(auth, browserSessionPersistence);
                console.log("Persistence set to session.");
            } catch (error) {
                console.error("Error setting persistence:", error);
            }
        };

        configurePersistence();

        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            console.log("Auth state changed:", user);
        });

        return () => {
            unsub();
        };
    }, []);

    return(
    <AuthContext.Provider value={{currentUser}}>
        {children}
    </AuthContext.Provider>
    )
}