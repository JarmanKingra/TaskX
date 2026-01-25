"use client";

import { useState, useEffect } from "react";
import { clientServer } from "@/lib/index";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import styles from "../login/login.module.css";
import { useNotificationStore } from "@/store/notificationStore";
import ButtonSpinner from "@/components/loaders/longSpinnerLoader";

export default function RegisterPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const loginStore = useAuthStore((s) => s.login);
  const notify = useNotificationStore((s) => s.show);

  useEffect(() => {
    if (token && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [token, isLoggedIn]);

  const [email, setEmail] = useState("");
  const [fullName, setfullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password || !fullName) {
      notify("All fields are required", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await clientServer.post("/api/auth/signup", {
        email,
        password,
        fullName
      });

      const token = res.data.token;
      const user = res.data.user;

      loginStore(token, user);

      notify("Registration successful", "success");
      router.replace("/auth/login");
    } catch (err) {
      notify(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <input
            className={styles.input}
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            className={styles.input}
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
            placeholder="Name"
          />

          <input
            className={styles.input}
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? <ButtonSpinner text="Registering..." /> : "Signup"}
          </button>
          
        </form>

        <div className={styles.footer}>
          Already have an account? <a href="/auth/login">Login</a>
        </div>
      </div>
    </div>
  );
}
