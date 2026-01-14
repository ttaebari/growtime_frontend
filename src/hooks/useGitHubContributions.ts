import { useState, useEffect, useCallback } from "react";
import { GitHubContributions, ContributionStats } from "@/types/github/types";
import { GitHubService } from "@/services/githubService";

export const useGitHubContributions = (username: string | null) => {
    const [contributions, setContributions] = useState<GitHubContributions | null>(null);
    const [stats, setStats] = useState<ContributionStats | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchContributions = useCallback(async () => {
        if (!username) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await GitHubService.getContributions(username);
            setContributions(data);

            const statsData = GitHubService.getStats(data);
            setStats(statsData);
        } catch (err) {
            console.error(err);
            setError("GitHub 데이터를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            fetchContributions();
        }
    }, [username, fetchContributions]);

    return {
        contributions,
        stats,
        isLoading,
        error,
        refetch: fetchContributions,
    };
};
