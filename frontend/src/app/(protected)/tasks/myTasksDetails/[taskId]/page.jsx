"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import styles from "./tasksDetails.module.css";

export default function TaskDetailsPage() {
  const [openTaskId, setOpenTaskId] = useState(null);

  const { taskId } = useParams();

  const { fetchTaskById, updateTaskStatus, currentTask, loading, error } = useTaskStore();

  useEffect(() => {
    if (taskId) fetchTaskById(taskId);
  }, [taskId]);

  const handleStatusChange = async (status) => {
    await updateTaskStatus(currentTask._id, status);
    setOpenTaskId(null);
  }

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>{error}</p>;
  if (!currentTask) return null;

  return (
  <div className={styles.taskPage}>
    <div className={styles.taskCard}>
      <h2 className={styles.taskTitle}>{currentTask.title}</h2>

      <p className={styles.taskText}>
        <span>Description -</span> {currentTask.description}
      </p>

      <p className={styles.taskText}>
        <span>Status:</span>
        <span className={styles.status}>{currentTask.status}</span>
      </p>

      <button
        className={styles.updateBtn}
        onClick={() => setOpenTaskId(currentTask._id)}
      >
        Update Status
      </button>

      <div className={styles.metaInfo}>
        <p>
          <span>Assigned By:</span> {currentTask.assignedBy?.fullName}
        </p>
        <p>
          <span>Team:</span> {currentTask.team?.name}
        </p>
      </div>
    </div>

    {openTaskId && (
      <div className={styles.overlay} onClick={() => setOpenTaskId(null)}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Update Task Status</h3>

          <button
            className={styles.modalBtn}
            onClick={() => handleStatusChange("pending")}
          >
            Pending
          </button>

          <button
            className={`${styles.modalBtn} ${styles.inProgress}`}
            onClick={() => handleStatusChange("in-progress")}
          >
            In Progress
          </button>

          <button
            className={`${styles.modalBtn} ${styles.completed}`}
            onClick={() => handleStatusChange("completed")}
          >
            Completed
          </button>
        </div>
      </div>
    )}
  </div>
);

}
