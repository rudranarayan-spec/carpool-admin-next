// lib/firebase/messaging.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import firebaseApp from "./config";

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";

let messagingInstance: ReturnType<typeof getMessaging> | null = null;

export async function getFCMToken(): Promise<string | null> {
  try {
    if (typeof window === "undefined") return null;

    const supported = await isSupported();

    if (!supported) {
      console.log("[FCM] Browser doesn't support FCM.");
      return null;
    }

    if (!("serviceWorker" in navigator)) {
      console.log("[FCM] Service Worker not supported.");
      return null;
    }

    // Register Service Worker
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    // Wait until activated
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("[FCM] Notification permission denied.");
      return null;
    }

    messagingInstance = getMessaging(firebaseApp);

    const token = await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("[FCM] No token returned.");
      return null;
    }

    console.log("[FCM] Token:", token);

    return token;
  } catch (error) {
    console.error("[FCM] Error:", error);
    return null;
  }
}

export async function listenForForegroundMessages(
  callback: (payload: any) => void
) {
  const supported = await isSupported();

  if (!supported) return;

  if (!messagingInstance) {
    messagingInstance = getMessaging(firebaseApp);
  }

  return onMessage(messagingInstance, callback);
}