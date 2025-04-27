'use server';

import { TrophyApiClient } from '@trophyso/node';
import { EventResponse, MetricResponse } from '@trophyso/node/api';

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
 * Get the progress for a user
 * @returns The progress for the user
 */
export async function getProgress(): Promise<MetricResponse | null> {
    try {
        return await trophy.users.singlemetric(
            USER_ID,
            FLASHCARDS_VIEWED_METRIC_KEY
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}