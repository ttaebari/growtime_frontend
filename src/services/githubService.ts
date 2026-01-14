import {
    ContributionDay,
    ContributionWeek,
    GitHubContributions,
    GitHubEvent,
    ContributionStats,
} from "@/types/github/types";

const GITHUB_API_BASE = "https://api.github.com";

export const GitHubService = {
    // 최근 이벤트 조회 (최대 100개, GitHub API 제한으로 인해 페이징 처리 필요할 수 있음)
    getEvents: async (username: string): Promise<GitHubEvent[]> => {
        try {
            // events API endpoint: /users/{username}/events
            // public events only if unauthenticated
            const response = await fetch(`${GITHUB_API_BASE}/users/${username}/events?per_page=100`);

            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to fetch GitHub events:", error);
            throw error;
        }
    },

    // 이벤트를 잔디 데이터로 변환 (최근 12주)
    getContributions: async (username: string): Promise<GitHubContributions> => {
        try {
            const events = await GitHubService.getEvents(username);

            // 날짜 계산 (오늘부터 12주 전까지)
            const today = new Date();

            // 12주 전 (약 84일)
            const weeksAgo12 = new Date(today);
            weeksAgo12.setDate(today.getDate() - 84);

            // 시작일을 12주 전의 일요일로 맞춤 (일~토 주차 정렬을 위해)
            const startDate = new Date(weeksAgo12);
            const dayOfWeek = weeksAgo12.getDay(); // 0(일) ~ 6(토)
            startDate.setDate(weeksAgo12.getDate() - dayOfWeek);

            // 날짜별 커밋 수 맵 생성
            const contributionMap = new Map<string, number>();

            // 초기화: 시작일부터 오늘까지 날짜 생성
            let currentDate = new Date(startDate);
            while (currentDate <= today) {
                const dateStr = currentDate.toISOString().split("T")[0];
                contributionMap.set(dateStr, 0);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // 이벤트 카운팅
            let totalCount = 0;
            events.forEach((event) => {
                // PushEvent와 CreateEvent만 커밋/기여로 간주
                if (event.type === "PushEvent" || event.type === "CreateEvent") {
                    const dateStr = event.created_at.split("T")[0];
                    if (contributionMap.has(dateStr)) {
                        let count = 0;
                        if (event.type === "PushEvent" && event.payload.commits) {
                            count = event.payload.commits.length;
                        } else {
                            count = 1; // CreateEvent 등은 1회 기여로 간주
                        }

                        contributionMap.set(dateStr, (contributionMap.get(dateStr) || 0) + count);
                        totalCount += count;
                    }
                }
            });

            // 주 단위로 데이터 구조화
            const weeks: ContributionWeek[] = [];
            currentDate = new Date(startDate);

            // 시작 날짜를 해당 주의 일요일(또는 월요일)로 맞출 필요가 있을 수 있음
            // 여기서는 단순하게 12주(84일)를 순차적으로 채움

            let currentWeek: ContributionDay[] = [];

            // 날짜 순회
            currentDate = new Date(startDate);
            while (currentDate <= today) {
                const dateStr = currentDate.toISOString().split("T")[0];
                const count = contributionMap.get(dateStr) || 0;

                // 레벨 계산 (임의 기준)
                let level: 0 | 1 | 2 | 3 | 4 = 0;
                if (count > 0) level = 1;
                if (count > 3) level = 2;
                if (count > 6) level = 3;
                if (count > 10) level = 4;

                currentWeek.push({
                    date: dateStr,
                    count,
                    level,
                });

                if (currentWeek.length === 7) {
                    weeks.push({ days: currentWeek });
                    currentWeek = [];
                }

                currentDate.setDate(currentDate.getDate() + 1);
            }

            // 마지막 주가 7일이 안되면 채워넣기 (이번 예제에서는 84일 딱 맞춤)
            if (currentWeek.length > 0) {
                weeks.push({ days: currentWeek });
            }

            return {
                weeks,
                totalCount,
                startDate: startDate.toISOString().split("T")[0],
                endDate: today.toISOString().split("T")[0],
            };
        } catch (error) {
            console.error("Failed to generate contributions:", error);
            throw error;
        }
    },

    // 통계 계산
    getStats: (contributions: GitHubContributions): ContributionStats => {
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let totalCommits = 0;
        const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // 일~토

        let daysProcessed = 0;

        // Flatten days for easier processing
        const allDays: ContributionDay[] = [];
        contributions.weeks.forEach((week) => allDays.push(...week.days));

        allDays.forEach((day) => {
            totalCommits += day.count;
            if (day.count > 0) {
                tempStreak++;
            } else {
                if (tempStreak > longestStreak) longestStreak = tempStreak;
                tempStreak = 0;
            }

            // 요일별 카운트 (날짜 문자열 -> Date -> getDay())
            const dayOfWeek = new Date(day.date).getDay();
            dayCounts[dayOfWeek] += day.count;

            daysProcessed++;
        });

        // 마지막 streak 확인
        if (tempStreak > longestStreak) longestStreak = tempStreak;

        // 현재 streak (뒤에서부터)
        let streak = 0;
        for (let i = allDays.length - 1; i >= 0; i--) {
            if (allDays[i].count > 0) {
                streak++;
            } else {
                // 오늘 기여가 없어도 어제까지 했으면 streak 유지인지 확인 필요
                // 여기서는 단순히 0 만나면 끊김, 단 오늘이 0이고 어제가 있었으면?
                // 로직 단순화를 위해 마지막 날부터 연속 0이 아닌 날들 카운트
                if (i === allDays.length - 1 && allDays[i].count === 0) continue; // 오늘은 아직 안했을 수 있음
                break;
            }
        }
        currentStreak = streak;

        const days = ["일", "월", "화", "수", "목", "금", "토"];
        const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));

        return {
            totalCommits,
            currentStreak,
            longestStreak,
            averagePerDay: Math.round((totalCommits / daysProcessed) * 10) / 10,
            mostActiveDay: days[maxDayIndex],
        };
    },
};
