"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export default function NavBarComponent() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const currUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isLoggedIn && token) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, token]);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          TaskX
        </h1>
        <div className={styles.navBarOptionContainer}>
          {isLoggedIn && token ? (
            <div>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <p>Hey, {currUser.name}</p>
                <p
                  onClick={() => router.replace("/profile")}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  Profile
                </p>
                <p
                  onClick={() => {
                    logout();
                    router.replace("/auth/login");
                  }}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  LogOut
                </p>
              </div>
            </div>
          ): (
            <div
              onClick={() => {
                router.replace("/auth/login");
              }}
              className={styles.buttonJoin}
            >
              Be a part
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
