"use client";

import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import MyTasksComponent from "@/components/tasks/myTasks/MyTasks";
import styles from "./tasks.module.css";

export default function MyTasks() {
  return <MyTasksContent />;
}

function MyTasksContent() {
  const user = useAuthStore((s) => s.user);
  const { tasks, fetchMyTasks, loading, error } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  if (!user) return <div>Loading user...</div>;
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading Tasks...</p>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <MyTasksComponent
      tasks={tasks}
      onOpenTask={(taskId) => router.push(`/tasks/myTasksDetails/${taskId}`)}
    />)
}
