import { useState, useEffect, useCallback } from "react";
import { QuickLink, CreateQuickLinkRequest } from "@/types/quicklink/types";
import { QuickLinkService } from "@/services/quickLinkService";

export const useQuickLinks = (githubId: string | undefined) => {
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuickLinks = useCallback(async () => {
        if (!githubId) return;

        setIsLoading(true);
        try {
            const data = await QuickLinkService.getQuickLinks(githubId);
            setQuickLinks(data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch quick links:", err);
            setError("퀵 링크를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [githubId]);

    const addQuickLink = async (request: CreateQuickLinkRequest) => {
        if (!githubId) return;

        try {
            const newLink = await QuickLinkService.createQuickLink(githubId, request);
            setQuickLinks((prev) => [...prev, newLink]);
            return true;
        } catch (err) {
            console.error("Failed to add quick link:", err);
            setError("퀵 링크 추가에 실패했습니다.");
            return false;
        }
    };

    const deleteQuickLink = async (linkId: number) => {
        if (!githubId) return;

        try {
            await QuickLinkService.deleteQuickLink(githubId, linkId);
            setQuickLinks((prev) => prev.filter((link) => link.id !== linkId));
            return true;
        } catch (err) {
            console.error("Failed to delete quick link:", err);
            setError("퀵 링크 삭제에 실패했습니다.");
            return false;
        }
    };

    useEffect(() => {
        if (githubId) {
            fetchQuickLinks();
        }
    }, [githubId, fetchQuickLinks]);

    return {
        quickLinks,
        isLoading,
        error,
        addQuickLink,
        deleteQuickLink,
        refetch: fetchQuickLinks,
    };
};
