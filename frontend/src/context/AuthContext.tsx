import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    name: string;
    setName: (name: string) => void;
    loading: boolean;
    photoUrl: string | null; // Add a photoUrl state
    setPhotoUrl: (url: string | null) => void; // Add a setter for the photoUrl
    refreshUserData: () => void; // Function to refresh user data
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null); // Initialize photoUrl state

    useEffect(() => {
        refreshUserData();
    }, []); // Run only once when the component mounts

    const refreshUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8000/api/user', {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            if (response.ok) {
                const content = await response.json();
                setName(content.name);
                const fullPhotoUrl = content.profile_picture ? `http://localhost:8000${content.profile_picture}` : `http://localhost:8000/media/profile_pictures/blank.jpg`;
                setPhotoUrl(fullPhotoUrl);
            } else {
                setName('');
                setPhotoUrl(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setName('');
            setPhotoUrl(null);
        } finally {
            setLoading(false);
        }
    };

    const contextValue: AuthContextType = {
        name,
        setName,
        loading,
        photoUrl,
        setPhotoUrl,
        refreshUserData,
    };

    return (
        <AuthContext.Provider value={contextValue}>
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
