"use client";

import ProtectedRoute from "@/components/guards/protectedRoute";
import NavBarComponent from "@/components/layouts/navbar";
import styles from "../../styles/Home.module.css"
import BackButton from "@/components/backButton/backButton";

export default function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
        <NavBarComponent />
        <div className={styles.protectedRoutes}>
          <BackButton/>
        {children}
      </div>
    </ProtectedRoute>
  );
}
