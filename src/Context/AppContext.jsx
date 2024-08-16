import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUser()
    }, []);

    async function getUser() {
        const res = await fetch("/api/auth/user", {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                "Content-Type": 'application/json',
            }
        });
        const data = await res.json();

        if (res.ok) {
            setUser(data);
        } else {
            setUser(null);
        }

        setLoading(false);
    }

    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        <AppContext.Provider value={{ token, setToken, user, setUser, loading }}>
            {children}
        </AppContext.Provider>
    );
}
