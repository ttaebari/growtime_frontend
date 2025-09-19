export type User = {
    id: number;
    githubId: string;
    login: string;
    name: string;
    email: string;
    avatarUrl: string;
    entryDate: string | null;
    dischargeDate: string | null;
};

export type DDayInfo = {
    dDayCount: number;
    serviceDays: number;
    totalServiceDays: number;
    entryDate: string;
    dischargeDate: string;
    progressPercentage: number;
};
