"use client";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (token && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [token, isLoggedIn]);

  return (
    <main className={`${styles.main}}`}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>TaskX</div>
        <div className={styles.navLinks}>
          <button  onClick={() => {router.push("/auth/login")}} className={styles.navBtn}>Sign In</button>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1>
          Manage Tasks <br />
          <span>Effortlessly with TaskX</span>
        </h1>

        <p>
          A powerful task management platform built for teams who want clarity,
          speed, and collaboration.
        </p>

        <div className={styles.cta}>
          <input type="email" placeholder="Your work email" />
          <button onClick={() => {router.push("/auth/register")}}>Start for free</button>
        </div>

        <p className={styles.subText}>
          No credit card required · Free forever for individuals
        </p>
      </section>
    </main>
  );
}
