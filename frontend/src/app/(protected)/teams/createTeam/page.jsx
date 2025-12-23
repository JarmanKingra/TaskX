"use client";

import { useState } from "react";
import { useTeamStore } from "@/store/teamStore";
import styles from "./style.module.css";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");

  const { createTeam, loading, error } = useTeamStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) return;

    await createTeam(teamName);
    setTeamName("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2>Create New Team</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={loading}
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
}
