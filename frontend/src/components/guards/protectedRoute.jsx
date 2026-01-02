"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      if (!token || !isLoggedIn) {
        router.replace("/");
      }
    }
  }, [ready, token, isLoggedIn, router]);

  if (!ready) return <div>Loading...</div>;

  return <>{children}</>;
}
