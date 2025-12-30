"use client";

import styles from "./dashbaord.module.css";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("logged in user : ", user);
    }
  }, [user]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className={styles.mainContainer}>
        {/* <h3 className={styles.glitchText}>Hi {user.name}</h3> */}

        <h3 className={styles.greeting}>
          Hi <span>{user.name}</span>
        </h3>

        <div className={styles.container}>
          <div className={styles.container1}>
            <div className={styles.tagLine}>
              <p>Manage Tasks Effortlessly with TaskX</p>
            </div>

            <div className={styles.mainHeading}>
              <h2>
                Simplify Your Workflow with TaskX
              </h2>
            </div>

            <div className={styles.paraLine}>
              <p>
                Empower your organization with TaskX's seamless workforce,
                intelligent task automation, and advanced omnichannel
                communication--so your team can focus on what truly matters.
              </p>
            </div>

            <div>
              {user.role == "admin" ? (
                <button onClick={() => router.replace("/teams/myTeams")} className={styles.button}>My Teams</button>
              ) : (
                <button onClick={() => router.replace("/tasks/myTasks")} className={styles.button}>My Tasks</button>
              )}
            </div>
          </div>

          <div className={styles.container2}>
            <img src="image.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}
