'use server';

import { TrophyApiClient } from '@trophyso/node';
import { EventResponse, StreakResponse, CompletedAchievementResponse, GetUserPointsResponse, UsersPointsEventSummaryResponseItem, PointsSummaryResponse, PointsSystemResponse, LeaderboardResponseWithRankings, UserLeaderboardResponse } from '@trophyso/node/api';
import dayjs from 'dayjs';

const FLASHCARDS_VIEWED_METRIC_KEY = "flashcards-viewed";
const POINTS_SYSTEM_KEY = "points";
const LEADERBOARD_KEY = "daily-champions";

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
export async function getAchievements(userId: string, includeIncomplete: boolean = false): Promise<CompletedAchievementResponse[] | null> {
    try {
        return await trophy.users.achievements(userId, {
            includeIncomplete: includeIncomplete ? "true" : undefined
        });
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

/**
 * Get the points system
 * @returns The points system
 */
export async function getPointsSystem(): Promise<PointsSystemResponse | null> {
    try {
        return await trophy.points.system(POINTS_SYSTEM_KEY);
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get the points for a user
 * @returns The points for the user
 */
export async function getUserPoints(userId: string): Promise<GetUserPointsResponse | null> {
    try {
        return await trophy.users.points(userId, POINTS_SYSTEM_KEY, {
            awards: 5
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Get the points summary for a user
 * @returns The points summary for the user
 */
export async function getPointsSummary(userId: string): Promise<UsersPointsEventSummaryResponseItem[] | null> {
    try {
        const now = dayjs();

        return await trophy.users.pointsEventSummary(
            userId,
            POINTS_SYSTEM_KEY,
            {
                aggregation: "daily",
                startDate: now.subtract(6, 'day').toISOString().split('T')[0],
                endDate: now.toISOString().split('T')[0]
            }
        );
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getOverallPointsSummary(): Promise<PointsSummaryResponse | null> {
    try {
        return await trophy.points.summary(POINTS_SYSTEM_KEY);
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getLeaderboard(
    limit?: number,
    offset?: number,
    userId?: string,
    runDate?: string
): Promise<LeaderboardResponseWithRankings | null> {
    try {
        return await trophy.leaderboards.get(LEADERBOARD_KEY, {
            limit: limit || 10,
            offset: offset || 0,
            userId: userId || undefined,
            run: runDate || undefined
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUserLeaderboard(userId: string, run?: string): Promise<UserLeaderboardResponse | null> {
    try {
        return await trophy.users.leaderboard(userId, LEADERBOARD_KEY, {
            run
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}