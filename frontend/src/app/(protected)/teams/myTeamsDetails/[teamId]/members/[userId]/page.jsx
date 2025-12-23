"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import styles from "./style.module.css";

export default function MemberTasksPage() {
  const router = useRouter();
  const [openTaskId, setOpenTaskId] = useState(null);
  const { teamId, userId } = useParams();
  const {
    getMemberTasks,
    memberTasks,
    loading,
    error,
    memberInfo,
    deleteTask,
  } = useTaskStore();

  useEffect(() => {
    if (teamId && userId) {
      getMemberTasks(teamId, userId);
    }
  }, [teamId, userId]);

  const handleDeleteTask = async () => {
    await deleteTask(openTaskId);
    setOpenTaskId(null);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      {memberInfo && (
        <div className={styles.headings}>
          <div>
            <h2>Member name - {memberInfo.fullName}</h2>
            <p>{memberInfo.email}</p>
          </div>
          <div>
            <button
              className={styles.button}
              onClick={() =>
                router.push(
                  `/teams/myTeamsDetails/${teamId}/assignTask/${memberInfo._id}`
                )
              }
            >
              Assign Task
            </button>
          </div>
        </div>
      )}

      {memberTasks.length === 0 && (
        <p className={styles.empty}>No tasks assigned</p>
      )}

      <div className={styles.tasksGrid}>
        {memberTasks.map((task) => (
          <div key={task._id} className={styles.taskCard}>
            <h4 className={styles.taskTitle}>{task.title}</h4>
            <p className={styles.taskDesc}> {task.description}</p>

            <div className={styles.taskOptions}>
              <span
                className={`${styles.status} ${
                  task.status === "pending"
                    ? styles.pending
                    : task.status === "in-progress"
                    ? styles.inProgress
                    : styles.completed
                }`}
              >
                {task.status}
              </span>
              <button
                onClick={() => setOpenTaskId(task._id)}
                className={styles.deleteTaskBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {openTaskId && (
        <div className={styles.overlay} onClick={() => setOpenTaskId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure to delete this Task ?</h3>
            <button
              className={`${styles.modalBtn} ${styles.delete}`}
              onClick={handleDeleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
