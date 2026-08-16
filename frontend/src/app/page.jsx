"use client";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Navbar from "@/components/homePageComps/Navbar/page";
import Hero1 from "@/components/homePageComps/homepage/page";
import Features from "@/components/homePageComps/features/page";
import Cta from "@/components/homePageComps/cta/page";
import Footer from "@/components/homePageComps/footer/page";

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

      <Navbar />
      <Hero1/>
      <Features/>
      <Cta/>
      <Footer/>
    </main>
  );
}
