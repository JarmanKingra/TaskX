"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { Eye } from "lucide-react";
import styles from "./style.module.css";

export default function TaskDetailsPage() {
  const { teamId } = useParams();
  const router = useRouter();
  const [openTeamId, setOpenTeamId] = useState(null);
  const [email, setEmail] = useState("");

  const { fetchTeamById, currTeam, loading, error, removeMember, addMember } =
    useTeamStore();
  const admin = currTeam?.admin;
  const members = currTeam?.members.filter((m) => m._id !== admin._id);

  const handleRemoveMember = async (teamId, memberId) => {
    try {
      await removeMember(teamId, memberId);
    } catch (err) {
      console.error(err);
    }
  };

  const addNewMember = async () => {
    await addMember(openTeamId, email);
    setOpenTeamId(null);
  };

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
          <div className={styles.mainHeadingOptions}>
            <h3>Team Members </h3>
            <button onClick={() => setOpenTeamId(currTeam._id)}>
              Add Member
            </button>
          </div>
        </div>

        {admin && (
          <div className={styles.adminContainer}>
            <p className={styles.adminBadge}>Admin - {admin.fullName}</p>
          </div>
        )}

        {members.length < 1 && (
          <p className={styles.noMemberYet}>No members yet!</p>
        )}

        {members.map((member) => (
          <div key={member._id} className={styles.membersContainer}>
            <h3>{member.fullName}</h3>

            <div className={styles.memberOptions}>
              <button onClick={() => handleRemoveMember(teamId, member._id)}>
                <p>Remove</p>
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/teams/myTeamsDetails/${teamId}/members/${member._id}`
                  )
                }
              >
                <p>view</p>
              </button>
            </div>
          </div>
        ))}
      </div>
      {openTeamId && (
        <div className={styles.overlay} onClick={() => setOpenTeamId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Enter the Email of Member</h3>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className={`${styles.modalBtn} ${styles.addMember}`}
              onClick={addNewMember}
            >
              Add Member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
