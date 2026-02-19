'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { GetUserPointsResponse } from '@trophyso/node/api';
import { getUserEnergy } from '@/app/actions';
import { getUserId } from '@/lib/user';
import { useUserIdentification } from './UserIdentificationContext';

interface UserEnergyContextType {
    energy: GetUserPointsResponse | null;
    lastEnergy: GetUserPointsResponse | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const UserEnergyContext = createContext<UserEnergyContextType | undefined>(undefined);

interface UserEnergyProviderProps {
    children: ReactNode;
}

export function UserEnergyProvider({ children }: UserEnergyProviderProps) {
    const { isIdentified } = useUserIdentification();
    const [energy, setEnergy] = useState<GetUserPointsResponse | null>(null);
    const [lastEnergy, setLastEnergy] = useState<GetUserPointsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchEnergy = async () => {
        if (!isIdentified) {
            return;
        }

        const userId = getUserId();

        setLoading(true);
        setError(null);

        try {
            setLastEnergy(energy);
            const energyData = await getUserEnergy(userId);
            setEnergy(energyData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch energy');
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
            fetchEnergy();
        }, 300);
    }, [isIdentified]);

    useEffect(() => {
        if (!isIdentified) {
            return;
        }

        fetchEnergy();

        // Cleanup timeout on unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isIdentified]);

    const value: UserEnergyContextType = {
        energy,
        lastEnergy,
        loading,
        error,
        refetch,
    };

    return (
        <UserEnergyContext.Provider value={value}>
            {children}
        </UserEnergyContext.Provider>
    );
}

export function useUserEnergy() {
    const context = useContext(UserEnergyContext);

    if (context === undefined) {
        throw new Error('useUserEnergy must be used within a UserEnergyProvider');
    }

    return context;
}