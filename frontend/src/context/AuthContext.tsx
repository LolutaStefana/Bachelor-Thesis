import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    userId: number | null;
    setUserId: (id: number | null) => void;
    name: string;
    setName: (name: string) => void;
    loading: boolean;
    photoUrl: string | null;
    setPhotoUrl: (url: string | null) => void;
    refreshUserData: () => void;
    isTherapist: boolean; 
    setIsTherapist: (value: boolean) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userId, setUserId] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isTherapist, setIsTherapist] = useState<boolean>(false); 

    useEffect(() => {
        refreshUserData();
    }, []);

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
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
