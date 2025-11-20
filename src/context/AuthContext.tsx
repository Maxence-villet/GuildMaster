import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    code: string;
    role: string;
    clan_id: number;
    clan_name: string;
    created_at: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');

    await axios.post(
        "https://guildmaster-backend-fastapi.onrender.com/logout",
        {}, // body vide
        {
            headers: {
                "X-CSRF-Token": window._csrfToken!
            }
        }
    );
    // Optionnel : supprimer aussi le token en mémoire côté front
    window._csrfToken = undefined;
};


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};