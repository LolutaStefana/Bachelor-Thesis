import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Extend the interface to include isTherapist
interface AuthContextType {
    userId: number | null;
    setUserId: (id: number | null) => void;
    name: string;
    setName: (name: string) => void;
    loading: boolean;
    photoUrl: string | null;
    setPhotoUrl: (url: string | null) => void;
    refreshUserData: () => void;
    isTherapist: boolean; // Add isTherapist to the Auth context
    setIsTherapist: (value: boolean) => void; // Add setter for isTherapist
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isTherapist, setIsTherapist] = useState<boolean>(false); // Initialize isTherapist state

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
                setUserId(content.id);
                setName(content.name);
                const fullPhotoUrl = content.profile_picture
                    ? `http://localhost:8000${content.profile_picture}`
                    : `http://localhost:8000/media/profile_pictures/blank.jpg`;
                setPhotoUrl(fullPhotoUrl);

                // Check for is_therapist field in the response
                setIsTherapist(content.is_therapist || false);
            } else {
                setUserId(null);
                setName('');
                setPhotoUrl(null);
                setIsTherapist(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setUserId(null);
            setName('');
            setPhotoUrl(null);
            setIsTherapist(false);
        } finally {
            setLoading(false);
        }
    };

    const contextValue: AuthContextType = {
        userId,
        setUserId,
        name,
        setName,
        loading,
        photoUrl,
        setPhotoUrl,
        refreshUserData,
        isTherapist,
        setIsTherapist,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to access the Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
