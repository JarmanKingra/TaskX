"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import styles from "./navbar.module.css";

export default function NavBarComponent() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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
                <p
                  onClick={() => router.replace("/dashboard")}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  Home
                </p>
                {user.role == "admin" ? (
                  <p
                    onClick={() => router.replace("/teams/myTeams")}
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                  >
                    My Teams
                  </p>
                ) : (
                  <p
                    onClick={() => router.replace("/tasks/myTasks")}
                    style={{ fontWeight: "bold", cursor: "pointer" }}
                  >
                    My Tasks
                  </p>
                )}
                <p
                  onClick={() => {
                    logout();
                    router.replace("/auth/login");
                  }}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                  Logout
                </p>
              </div>
            </div>
          ) : (
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
