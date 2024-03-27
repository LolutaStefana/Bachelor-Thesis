import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    name: string;
    setName: (name: string) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/user', {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                if (response.ok) {
                    const content = await response.json();
                    setName(content.name);
                } else {
                    setName('');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ name, setName, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
