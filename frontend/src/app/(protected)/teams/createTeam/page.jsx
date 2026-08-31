"use client";

import { useState } from "react";
import { useTeamStore } from "@/store/teamStore";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const { createTeam, loading, error } = useTeamStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) return;

    // Passing description along with teamName if your store supports object/multi-arg payload
    await createTeam(teamName);
    setTeamName("");
    setDescription("");
    router.back();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>Create New Team</h2>
          <p className={styles.subtitle}>
            Set up a collaborative workspace for your teammates and project members.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="teamName" className={styles.label}>
              Team Name *
            </label>
            <input
              id="teamName"
              type="text"
              className={styles.input}
              placeholder="e.g. Engineering Lead, Design Studio"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              className={styles.textarea}
              placeholder="What is this team working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !teamName.trim()}
            >
              {loading ? (
                <>
                  <div className={styles.spinner} />
                  <span>Creating...</span>
                </>
              ) : (
                "Create Team"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}