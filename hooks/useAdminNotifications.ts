"use client";

import { useEffect, useState, useRef, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

export interface AdminNotificationPayload {
  type: "RIDE_BOOKED" | "RIDE_PUBLISHED" | "RIDE_CANCELLED" | "CONVERSATION" | string;
  title: string;
  message: string;
  timestamp: string;
  data?: {
    rideId?: number | string;
    bookingId?: number | string;
    conversationId?: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

// React 19 idiomatic pattern for client hydration detection without cascading renders
const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export const useAdminNotifications = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  const isMounted = useIsMounted();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [lastNotification, setLastNotification] = useState<AdminNotificationPayload | null>(null);

  // Helper function to trigger Native Browser Notifications
  const showNativeNotification = useCallback(
    (payload: AdminNotificationPayload) => {
      if (typeof window === "undefined" || !("Notification" in window)) return;

      if (Notification.permission === "granted") {
        const notification = new Notification(payload.title, {
          body: payload.message,
          icon: "/favicon.ico",
          tag: payload.type,
        });

        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();

          if (payload.data?.rideId) {
            router.push(`/admin/rides/${payload.data.rideId}`);
          } else if (payload.data?.conversationId) {
            router.push(`/admin/conversations/${payload.data.conversationId}`);
          }
        };
      }
    },
    [router]
  );

  useEffect(() => {
    // 1. Asynchronously request permission if 'default'
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((res) => setPermission(res));
      } else {
        // Safe asynchronous update to sync initial permission state
        queueMicrotask(() => setPermission(Notification.permission));
      }
    }

    // 2. Initialize Socket instance
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    const socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    // 3. Socket event handlers
    const handleConnect = () => {
      console.log("🔌 Connected to Notification Socket. Socket ID:", socket.id);
      socket.emit("join_admin_control_room");
    };

    const handleAdminNotification = (payload: AdminNotificationPayload) => {
      console.log("🔔 Realtime Notification Received:", payload);

      setLastNotification(payload);

      toast.info(payload.title, {
        description: payload.message,
      });

      showNativeNotification(payload);

      switch (payload.type) {
        case "RIDE_BOOKED":
        case "RIDE_PUBLISHED":
        case "RIDE_CANCELLED":
          queryClient.invalidateQueries({ queryKey: ["rides"] });
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
          break;
        case "CONVERSATION":
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          break;
        default:
          queryClient.invalidateQueries();
          break;
      }
    };

    socket.on("connect", handleConnect);
    socket.on("admin_notification", handleAdminNotification);

    // 4. Clean up on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("admin_notification", handleAdminNotification);
      socket.emit("leave_admin_control_room");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient, showNativeNotification]);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    }
    return "denied";
  };

  return {
    isMounted,
    permission,
    requestPermission,
    lastNotification,
  };
};