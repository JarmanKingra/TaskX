"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import styles from "./notification.module.css";

export default function NotificationBanner() {
  const { message, type, clear } = useNotificationStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(clear, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, clear]);

  if (!message) return null;

  return (
    <div className={`${styles.banner} ${styles[type]}`}>
      <span>{message}</span>
      <button style={{color: "black"}} onClick={clear}>✕</button>
    </div>
  );
}
