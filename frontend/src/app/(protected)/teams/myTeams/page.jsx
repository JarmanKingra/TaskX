"use client";

import { useAuthStore } from "@/store/authStore";
import { useTeamStore } from "@/store/teamStore";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyTeams() {
  return <MyTeamsContent />
}

function MyTeamsContent() {
  const user = useAuthStore((s) => s.user);
  const { teams, loading, error, getMyTeams } = useTeamStore();
  const router = useRouter();

  useEffect(() => {
    getMyTeams();
  }, []);

  if (!user) return <div>Loading user...</div>;
  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading Teams...</p>
      </div>
    );
  }
  if (error) return <div>{error}</div>;

  return (
    <>
    
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.mainHeading}>
            <div className={styles.mainHeadingOptions}>
              <h3>Teams - {teams.length}</h3>
            </div>
            <div className={styles.mainHeadingOptions}>
              <button
                className={styles.createTeamButton}
                onClick={() => {
                  router.push(`/teams/createTeam`);
                }}
              >
                Create Team
              </button>
            </div>
          </div>

          {teams.length == 0 && (
            <p className={styles.empty}>No teams created yet.</p>
          )}

          <div className={styles.MyTeamDetails}>
            {teams.map((team) => (
              <div key={team._id} className={styles.MyTeamDetailCard}>
                <div className={styles.MyTeamDetailCardContent}>
                  <div className={styles.myTeamHeading}>
                    <h3>{team.name}</h3>
                  </div>

                  <div className={styles.myTeamOptions}>
                    <div className={styles.options}>{team.members.length}</div>
                    <div className={styles.options}>
                      <button
                        onClick={() => {
                          router.push(`/teams/myTeamsDetails/${team._id}`);
                        }}
                        className={styles.options}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
