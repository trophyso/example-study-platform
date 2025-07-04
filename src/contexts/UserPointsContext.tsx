'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { GetUserPointsResponse } from '@trophyso/node/api';
import { getUserPoints } from '@/app/actions';
import { getUserId } from '@/lib/user';

interface UserPointsContextType {
    points: GetUserPointsResponse | null;
    lastPoints: GetUserPointsResponse | null;
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
    const [lastPoints, setLastPoints]
        = useState<GetUserPointsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchPoints = async () => {
        const userId = getUserId();

        setLoading(true);
        setError(null);

        try {
            setLastPoints(points);
            const pointsData = await getUserPoints(userId);
            setPoints(pointsData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch points');
        } finally {
            setLoading(false);
        }
    };

    const refetch = useCallback(async () => {
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout to debounce the call
        timeoutRef.current = setTimeout(() => {
            fetchPoints();
        }, 300);
    }, []);

    useEffect(() => {
        fetchPoints();

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const value: UserPointsContextType = {
        points,
        lastPoints,
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