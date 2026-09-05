"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { useTaskStore } from "@/store/taskStore";
import styles from "./style.module.css";
import TeamView from "./components/teamView";
import MyTasksComponent from "@/components/tasks/myTasks/MyTasks";

export default function TaskDetailsPage() {
  const { teamId } = useParams();
  const router = useRouter();

  const [subComponent, setSubComponent] = useState("teamView");

  const { fetchTeamById, currTeam, loading, currentRole } =
    useTeamStore();

  const { tasks, fetchMyTasksInTeam, loading: taskLoading } = useTaskStore();

  useEffect(() => {
    if (teamId) {
      fetchTeamById(teamId);
    }
  }, [teamId]);

  useEffect(() => {
    if (currTeam) {
      fetchMyTasksInTeam(currTeam._id);
    }
  }, [currTeam]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  if (!currTeam) return <h1>No team found</h1>;

  if (!currentRole) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Checking role...</p>
      </div>
    );
  }

  if (subComponent === "teamView") {
    return <TeamView setSubComponent={setSubComponent} teamId={teamId} team={currTeam} />;
  }
  if (subComponent === "myTasks") {
    return <MyTasksComponent setSubComponent={setSubComponent} tasks={tasks} onOpenTask={(taskId) => router.push(`/tasks/myTasksDetails/${taskId}`)} />;
  }
  return null;
}
