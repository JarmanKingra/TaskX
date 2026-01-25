"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { useTaskStore } from "@/store/taskStore";
import styles from "./style.module.css";
import TeamAdminView from "./components/teamAdminView";
import TeamMemberView from "./components/teamMemberView";

export default function TaskDetailsPage() {
  const { teamId } = useParams();
  const router = useRouter();

  const { fetchTeamById, currTeam, loading, error, currentRole } =
    useTeamStore();

  const { tasks, fetchMyTasksInTeam, loading: taskLoading } = useTaskStore();

  useEffect(() => {
    if (teamId) {
      useTeamStore.setState({ currentRole: null });
      fetchTeamById(teamId);
    }
  }, [teamId]);

  useEffect(() => {
    if (currentRole === "user" && teamId) {
      fetchMyTasksInTeam(teamId);
    }
  }, [currentRole, teamId]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (error)
    return (
      <p>
        {error} {console.log(error)}
      </p>
    );
  if (!currTeam) return null;

  if (!currentRole) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Checking role...</p>
      </div>
    );
  }

  if (currentRole == "admin") {
    return <TeamAdminView teamId={teamId} team={currTeam} />;
  }
  if (currentRole === "user") {
    return (
      <TeamMemberView
        tasks={tasks}
        onOpenTask={(taskId) => router.push(`/tasks/myTasksDetails/${taskId}`)}
      />
    );
  }
  return null;
}
