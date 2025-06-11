'use server';

import { TrophyApiClient } from '@trophyso/node';
import { AchievementResponse, EventResponse, StreakResponse } from '@trophyso/node/api';

const USER_ID = "39";
const FLASHCARDS_VIEWED_METRIC_KEY = "flashcards-viewed";

// Set up Trophy SDK with API key
const trophy = new TrophyApiClient({
    apiKey: process.env.TROPHY_API_KEY as string,
});

/**
 * Track a flashcard viewed event in Trophy
 * @returns The event response from Trophy
 */
export async function viewFlashcard(): Promise<EventResponse | null> {
    try {
        return await trophy.metrics.event(FLASHCARDS_VIEWED_METRIC_KEY, {
            user: {
                // Mock email
                email: "user@example.com",

                // Mock timezone
                tz: "Europe/London",

                // Mock user ID
                id: USER_ID
            },

            // Event represents a single user viewing 1 flashcard
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
export async function getAchievements(): Promise<AchievementResponse[] | null> {
    try {
        return await trophy.users.allAchievements(USER_ID);
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get the streak for a user
 * @returns The streak for the user
 */
export async function getStreak(): Promise<StreakResponse | null> {
    try {
        return await trophy.users.streak(USER_ID, {
            historyPeriods: 14
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}