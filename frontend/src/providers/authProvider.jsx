"use client";

import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }) {
  // Zustand selectors
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {children}
    </>
  );
}

