"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import styles from "./style.module.css";

export default function AssignTaskPage() {
  const { teamId, assignedTo } = useParams();
  const { assignTask, loading, error } = useTaskStore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await assignTask(title, description, deadline, assignedTo, teamId);
    if(success){
      router.push(`/teams/myTeamsDetails/${teamId}/members/${assignedTo}`);
    }
  };

  // router.back();
  // e.preventDefault();
  //router.push(`/teams/myTeamsDetails/${teamId}/members/${assignedTo}`);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Assign Task</h2>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Deadline</label>
            <div className={styles.dateWrapper}>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <span className={styles.dateIcon}>📅</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
