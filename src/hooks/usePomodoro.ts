import { useState, useEffect, useCallback, useRef } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface PomodoroState {
    mode: TimerMode;
    timeLeft: number;
    isRunning: boolean;
}

const TIMER_SETTINGS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export const usePomodoro = () => {
    const [mode, setMode] = useState<TimerMode>("focus");
    const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.focus);
    const [isRunning, setIsRunning] = useState(false);

    // 오디오 컨텍스트 (알림음용)
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    }, []);

    const switchMode = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_SETTINGS[newMode]);
        setIsRunning(false);
    }, []);

    const toggleTimer = useCallback(() => {
        setIsRunning((prev) => !prev);
    }, []);

    const resetTimer = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(TIMER_SETTINGS[mode]);
    }, [mode]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            // 알림음 재생
            if (audioRef.current) {
                audioRef.current.play().catch((e) => console.log("Audio play failed", e));
            }
            // 브라우저 알림
            if (Notification.permission === "granted") {
                new Notification("Time's up!", {
                    body: `${mode === "focus" ? "Focus time" : "Break time"} is over.`,
                });
            }
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft, mode]);

    // 알림 권한 요청
    useEffect(() => {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = 1 - timeLeft / TIMER_SETTINGS[mode];

    return {
        mode,
        timeLeft,
        isRunning,
        progress,
        formatTime,
        switchMode,
        toggleTimer,
        resetTimer,
    };
};
