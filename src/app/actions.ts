'use server';

import { TrophyApiClient } from '@trophyso/node';
import { EventResponse, StreakResponse, CompletedAchievementResponse, GetUserPointsResponse, UsersPointsEventSummaryResponseItem, PointsSummaryResponse, PointsSystemResponse, LeaderboardResponseWithRankings, UserLeaderboardResponse, User } from '@trophyso/node/api';
import dayjs from 'dayjs';

const FLASHCARDS_VIEWED_METRIC_KEY = "flashcards-viewed";
const POINTS_SYSTEM_KEY = "points";
const LEADERBOARD_KEY = "daily-champions";
const ENERGY_SYSTEM_KEY = "energy";

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
        console.error("View flashcard error:", error);
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
        console.error("Get achievements error:", error);
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
        console.error("Get streak error:", error);
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
        console.error("Get points system error:", error);
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
        console.error("Get user points error:", error);
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
        console.error("Get points summary error:", error);
        return null;
    }
}

export async function getOverallPointsSummary(): Promise<PointsSummaryResponse | null> {
    try {
        return await trophy.points.summary(POINTS_SYSTEM_KEY);
    } catch (error) {
        console.error("Get overall points summary error:", error);
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
        console.error("Get leaderboard error:", error);
        return null;
    }
}

export async function getUserLeaderboard(userId: string, run?: string): Promise<UserLeaderboardResponse | null> {
    try {
        return await trophy.users.leaderboard(userId, LEADERBOARD_KEY, {
            run
        });
    } catch (error) {
        console.error("Get user leaderboard error:", error);
        return null;
    }
}

/**
 * Identify a user with Trophy
 * @returns The identification response from Trophy
 */
export async function identifyUser(userId: string): Promise<User | null> {
    try {
        return await trophy.users.identify(userId, {
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    } catch (error) {
        console.error("Identify user error:", error);
        return null;
    }
}

/**
 * Get the energy system
 * @returns The energy system
 */
export async function getEnergySystem(): Promise<PointsSystemResponse | null> {
    try {
        return await trophy.points.system(ENERGY_SYSTEM_KEY);
    } catch (error) {
        console.error("Get energy system error:", error);
        return null;
    }
}

/**
 * Get the energy for a user
 * @returns The energy for the user
 */
export async function getUserEnergy(userId: string): Promise<GetUserPointsResponse | null> {
    try {
        return await trophy.users.points(userId, ENERGY_SYSTEM_KEY, {
            awards: 5
        });
    } catch (error) {
        console.error("Get user energy error:", error);
        return null;
    }
}

/**
 * Get the energy summary for a user
 * @returns The energy summary for the user
 */
export async function getEnergySummary(userId: string): Promise<UsersPointsEventSummaryResponseItem[] | null> {
    try {
        const now = dayjs();

        return await trophy.users.pointsEventSummary(
            userId,
            ENERGY_SYSTEM_KEY,
            {
                aggregation: "daily",
                startDate: now.subtract(6, 'day').toISOString().split('T')[0],
                endDate: now.toISOString().split('T')[0]
            }
        );
    } catch (error) {
        console.error("Get energy summary error:", error);
        return null;
    }
}