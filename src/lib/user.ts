export const USER_ID_KEY = 'trophy_user_id';

export function getUserId(): string {
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        const newUserId = crypto.randomUUID();
        localStorage.setItem(USER_ID_KEY, newUserId);
        return newUserId;
    }

    return userId;
}
