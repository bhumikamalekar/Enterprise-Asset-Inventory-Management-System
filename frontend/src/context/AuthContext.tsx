import { createContext, useState, useEffect } from "react";

interface AuthType {
    isAuthenticated: boolean;
    login: (email: string, password: string, role: string) => void;
    logout: () => void;
    role: string | null;
    email: string | null;
    accountKey: string | null;
}

export const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({ children }: any) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [accountKey, setAccountKey] = useState<string | null>(null);

    /* Restore session after refresh */

    useEffect(() => {

        const session = localStorage.getItem("session");

        if (session) {

            const data = JSON.parse(session);

            setIsAuthenticated(true);
            setRole(data.role);
            setEmail(data.email);
            setAccountKey(data.accountKey);

        }

    }, []);

    const login = (userEmail: string, password: string, userRole: string) => {

        const key = userEmail + "_" + password;

        const session = {
            email: userEmail,
            role: userRole,
            accountKey: key
        };

        localStorage.setItem("session", JSON.stringify(session));

        setIsAuthenticated(true);
        setRole(userRole);
        setEmail(userEmail);
        setAccountKey(key);

    };

    const logout = () => {

        localStorage.removeItem("session");

        setIsAuthenticated(false);
        setRole(null);
        setEmail(null);
        setAccountKey(null);

    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                role,
                email,
                accountKey
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};