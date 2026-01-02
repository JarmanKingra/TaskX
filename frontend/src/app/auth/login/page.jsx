"use client";

import { useEffect, useState } from "react";
import { clientServer } from "@/lib/index";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { useNotificationStore } from "@/store/notificationStore";

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const notify = useNotificationStore((s) => s.show);

  useEffect(() => {
    if (token && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [token, isLoggedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      notify("Email and password are required", "error");
      return;
    }
    try {
      const res = await clientServer.post("api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        notify("Unexpected server response", "error");
        return;
      }

      loginStore(token, user);

      notify("Login successful 🎉", "success");
      router.push("/dashboard");
    } catch (err) {
      notify(err.response?.data?.message || "Login failed", "error");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>

        <div className={styles.footer}>
          Don’t have an account? <a href="/auth/register">Register</a>
        </div>
      </div>
    </div>
  );
}
