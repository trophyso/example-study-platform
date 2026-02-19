'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { identifyUser } from '@/app/actions';
import { getUserId } from '@/lib/user';

interface UserIdentificationContextType {
    isIdentified: boolean;
    loading: boolean;
    error: string | null;
}

const UserIdentificationContext = createContext<UserIdentificationContextType | undefined>(undefined);

interface UserIdentificationProviderProps {
    children: ReactNode;
}

export function UserIdentificationProvider({ children }: UserIdentificationProviderProps) {
    const [isIdentified, setIsIdentified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const identifyUserOnStart = async () => {
            try {
                setLoading(true);
                setError(null);

                const userId = getUserId();
                const user = await identifyUser(userId);

                if (user) {
                    setIsIdentified(true);
                } else {
                    setError('Failed to identify user with Trophy');
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to identify user';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        identifyUserOnStart();
    }, []);

    const value: UserIdentificationContextType = {
        isIdentified,
        loading,
        error,
    };

    return (
        <UserIdentificationContext.Provider value={value}>
            {children}
        </UserIdentificationContext.Provider>
    );
}

export function useUserIdentification() {
    const context = useContext(UserIdentificationContext);

    if (context === undefined) {
        throw new Error('useUserIdentification must be used within a UserIdentificationProvider');
    }

    return context;
}
