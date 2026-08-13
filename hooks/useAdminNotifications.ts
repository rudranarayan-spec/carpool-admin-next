/* eslint-disable @typescript-eslint/no-explicit-any */
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
    [key: string]: any;
  };
}

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

          // Safely handles both camelCase and snake_case properties
          const targetRideId = payload.data?.rideId || payload.data?.ride_id;
          const targetConversationId = payload.data?.conversationId || payload.data?.conversation_id;

          if (targetRideId) {
            router.push(`/admin/rides/${targetRideId}`);
          } else if (targetConversationId) {
            router.push(`/admin/conversations/${targetConversationId}`);
          }
        };
      }
    },
    [router]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((res) => setPermission(res));
      } else {
        queueMicrotask(() => setPermission(Notification.permission));
      }
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "https://carpool-node-backend-app.onrender.com";

    // Allow both WebSocket and Polling fallback for resilient connections
    const socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      withCredentials: true,
      autoConnect: true,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      console.log("🔌 Connected to Notification Socket. ID:", socket.id);
      socket.emit("join_admin_control_room");
    };

    const handleConnectError = (error: Error) => {
      console.error("❌ Socket Connection Error:", error.message);
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
    socket.on("connect_error", handleConnectError);
    socket.on("admin_notification", handleAdminNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
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