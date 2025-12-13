"use client";

import { useEffect, useState } from "react";
import { clientServer } from "@/lib/index";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (token && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [token, isLoggedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await clientServer.post("api/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      const user = res.data.user;

      if (!token || !user) {
        alert("Unexpected backend response");
        return;
      }

      loginStore({ token, user });

      alert("Login success!");
      router.push("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        <div className={styles.form}>
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

          <button className={styles.button} onClick={handleLogin}>
            Login
          </button>
        </div>

        <div className={styles.footer}>
          Don’t have an account? <a href="/auth/register">Register</a>
        </div>
      </div>
    </div>
  );
}
