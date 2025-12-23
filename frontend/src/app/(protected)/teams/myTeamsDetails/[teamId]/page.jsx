"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import styles from "./style.module.css";

export default function TaskDetailsPage() {
  const { teamId } = useParams();
  const router = useRouter();

  const { fetchTeamById, currTeam, loading, error } = useTeamStore();

  useEffect(() => {
    if (teamId) fetchTeamById(teamId);
  }, [teamId]);

  if (loading) return <p>Loading Team...</p>;
  if (error)
    return (
      <p>
        {error} {console.log(error)}
      </p>
    );
  if (!currTeam) return null;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.mainHeading}>
          <h3>OUR heading will be here || any other stuff</h3>
        </div>

        {currTeam.members.map((member) => (
          <div key={member._id} className={styles.membersContainer}>
            <h3>Name - {member.fullName}</h3>

            <div className={styles.memberOptions}>
              <button>Remove</button>
              <button
                onClick={() =>
                  router.push(
                    `/teams/myTeamsDetails/${teamId}/members/${member._id}`
                  )
                }
              >
                view
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
