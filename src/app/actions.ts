'use server';

import { TrophyApiClient } from '@trophyso/node';
import { EventResponse, AchievementResponse, StreakResponse } from '@trophyso/node/api';

const FLASHCARDS_VIEWED_METRIC_KEY = "flashcards-viewed";

// Set up Trophy SDK with API key
const trophy = new TrophyApiClient({
    apiKey: process.env.TROPHY_API_KEY as string,
});

/**
 * Track a flashcard viewed event in Trophy
 * @returns The event response from Trophy
 */
export async function viewFlashcard(userId: string): Promise<EventResponse | null> {
    try {
        return await trophy.metrics.event(FLASHCARDS_VIEWED_METRIC_KEY, {
            user: {
                id: userId
            },
            value: 1
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get the achievements for a user
 * @returns The achievements for the user
 */
export async function getAchievements(userId: string): Promise<AchievementResponse[] | null> {
    try {
        return await trophy.users.allAchievements(userId);
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get the streak for a user
 * @returns The streak for the user
 */
export async function getStreak(userId: string): Promise<StreakResponse | null> {
    try {
        return await trophy.users.streak(userId, {
            historyPeriods: 14
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}