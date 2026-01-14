export interface QuickLink {
    id: number;
    title: string;
    url: string;
    faviconUrl?: string;
}

export interface CreateQuickLinkRequest {
    title: string;
    url: string;
}
