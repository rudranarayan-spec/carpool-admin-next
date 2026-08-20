"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getFCMToken, listenForForegroundMessages } from "@/lib/firebase/messaging";
import { registerNotificationDevice } from "@/services/notification.service";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationProvider() {
    const { user, isAuthenticated } = useAuth();
    const isRegistered = useRef(false);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            isRegistered.current = false;
            return;
        }

        if (isRegistered.current) return;

        let unsubscribe: (() => void) | undefined;

        const setupFCM = async () => {
            if (!("Notification" in window)) {
                console.warn("This browser does not support web push notifications.");
                return;
            }

            // 1. Force prompt on every refresh if permission is still 'default'
            let currentPermission = Notification.permission;

            if (currentPermission === "default") {
                currentPermission = await Notification.requestPermission();
            }

            if (currentPermission === "denied") {
                toast.error("Notification permission is blocked", {
                    description: "Please allow notifications in your browser settings to receive alerts.",
                    duration: 6000,
                });
                return;
            }

            // 3. Proceed only if granted
            if (currentPermission !== "granted") return;

            // 4. Fetch FCM token and register device
            const token = await getFCMToken();
            if (!token) {
                console.warn("FCM Token generation returned empty.");
                return;
            }

            try {
                await registerNotificationDevice(token);
                isRegistered.current = true;
                console.log("✅ Admin notification device registered for user ID:", user.id);
            } catch (err) {
                console.error("Failed to register notification device", err);
            }

            unsubscribe = await listenForForegroundMessages((payload) => {
                toast(payload.notification?.title || "Carpooling Admin", {
                    description: payload.notification?.body,
                    duration: 5000,
                });
            });
        };

        setupFCM();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [isAuthenticated, user]);

    return null;
}