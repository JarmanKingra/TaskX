"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./style.module.css";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register"
  )
    return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <button className={styles.button} onClick={handleBack}>
      ← Back
    </button>
  );
}
