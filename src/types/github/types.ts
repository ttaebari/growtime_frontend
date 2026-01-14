export interface ContributionDay {
    date: string; // YYYY-MM-DD
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionWeek {
    days: ContributionDay[];
}

export interface GitHubContributions {
    weeks: ContributionWeek[];
    totalCount: number;
    startDate: string;
    endDate: string;
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: {
        id: number;
        login: string;
        display_login: string;
        gravatar_id: string;
        url: string;
        avatar_url: string;
    };
    repo: {
        id: number;
        name: string;
        url: string;
    };
    payload: {
        push_id?: number;
        size?: number;
        distinct_size?: number;
        ref?: string;
        head?: string;
        before?: string;
        commits?: Array<{
            sha: string;
            author: {
                email: string;
                name: string;
            };
            message: string;
            distinct: boolean;
            url: string;
        }>;
    };
    public: boolean;
    created_at: string;
}

export interface ContributionStats {
    totalCommits: number;
    currentStreak: number;
    longestStreak: number;
    averagePerDay: number;
    mostActiveDay: string;
}
