'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { GetUserPointsResponse } from '@trophyso/node/api';
import { getUserPoints } from '@/app/actions';
import { getUserId } from '@/lib/user';

interface UserPointsContextType {
    points: GetUserPointsResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const UserPointsContext = createContext<UserPointsContextType | undefined>(undefined);

interface UserPointsProviderProps {
    children: ReactNode;
}

export function UserPointsProvider({ children }: UserPointsProviderProps) {
    const [points, setPoints] = useState<GetUserPointsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPoints = async () => {
        const userId = getUserId();

        setLoading(true);
        setError(null);

        try {
            const pointsData = await getUserPoints(userId);
            setPoints(pointsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch points');
        } finally {
            setLoading(false);
        }
    };

    const refetch = async () => {
        await fetchPoints();
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    const value: UserPointsContextType = {
        points,
        loading,
        error,
        refetch,
    };

    return (
        <UserPointsContext.Provider value={value}>
            {children}
        </UserPointsContext.Provider>
    );
}

export function useUserPoints() {
    const context = useContext(UserPointsContext);

    if (context === undefined) {
        throw new Error('useUserPoints must be used within a UserPointsProvider');
    }
    return context;
} 