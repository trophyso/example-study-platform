'use server';

import { TrophyApiClient } from '@trophyso/node';
import { EventResponse } from '@trophyso/node/api';

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
        return await trophy.metrics.event("flashcards-viewed", {
            user: {
                // Mock email
                email: "user@example.com",

                // Mock timezone
                tz: "Europe/London",

                // Mock user ID
                id: "39"
            },

            // Event represents a single user viewing 1 flashcard
            value: 1
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}