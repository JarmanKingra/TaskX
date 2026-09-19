"use client";

import { useAuthStore } from "@/store/authStore";
import { useTeamStore } from "@/store/teamStore";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ButtonSpinner from "@/components/loaders/longSpinnerLoader";

export default function MyTeams() {
  return <MyTeamsContent />;
}

function MyTeamsContent() {
  const user = useAuthStore((s) => s.user);
  const { teams, loading, error, getMyTeams } = useTeamStore();
  const [navigationLoading, setNavigationLoading] = useState(null);
  const router = useRouter();

  function handleNavigation(path, id) {
    setNavigationLoading(id);
    router.push(path);
  }

  useEffect(() => {
    getMyTeams();
  }, [getMyTeams]);

  if (!user) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Authenticating user...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Fetching your workspace teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingWrapper}>
        <p style={{ color: "var(--color-warning)" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.titleArea}>
            <h1>My Teams</h1>
            <span className={styles.teamBadge}>{teams.length} active</span>
          </div>
          <button
            className={styles.createTeamButton}
            onClick={() => handleNavigation("/teams/createTeam", "CreateTeam")}
            disabled={navigationLoading === "CreateTeam"}
          >
            {navigationLoading === "CreateTeam" ? <ButtonSpinner text="Creating team..." /> : <><span>+</span> Create New Team</>}
          </button>
        </header>

        {/* Empty State */}
        {teams.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>No teams created yet</h3>
            <p className={styles.emptySubtitle}>
              Create your first team workspace to start collaborating with your members.
            </p>
          </div>
        ) : (
          /* Teams Grid */
          <div className={styles.grid}>
            {teams.map((team) => (
              <div key={team._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{team.name}</h3>
                  <p className={styles.cardDescription}>
                    {team.description || "No description provided for this team project."}
                  </p>
                </div>

                <div className={styles.cardFooter}>

                  <div className={styles.membersWrapper}>


                    <div className={styles.avatarGroup}>
                      {team.members.slice(0, 3).map((_, idx) => (
                        <div key={idx} className={styles.avatar}>
                          U{idx + 1}
                        </div>
                      ))}
                    </div>

                    <span className={styles.memberCount}>
                      {team.members.length} {team.members.length === 1 ? "member" : "members"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleNavigation(`/teams/myTeamsDetails/${team._id}`, team._id)}
                    disabled={navigationLoading === team._id}
                    className={styles.detailsButton}
                  >
                    {navigationLoading === team._id ? <ButtonSpinner text="Loading..." /> : <><span>Details</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </>}


                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
