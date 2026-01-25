"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import styles from "../style.module.css";

export default function TeamAdminView({ teamId, team }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [openRemoveMember, setOpenRemoveMember] = useState(null);
  const [openTeamId, setOpenTeamId] = useState(null);

  const { removeMember, addMember } = useTeamStore();

  const admin = team.admin;
  const members = team.members.filter((m) => m.role !== "admin");

  const handleRemoveMember = async (memberId) => {
    await removeMember(teamId, memberId);
    setOpenRemoveMember(null);
  };

  const addNewMember = async () => {
    await addMember(teamId, email);
    setEmail("");
    setOpenTeamId(null);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.mainHeading}>
          <div className={styles.mainHeadingOptions}>
            <h3>Team Members</h3>
            <button onClick={() => setOpenTeamId(teamId)}>Add Member</button>
          </div>
        </div>

        <p className={styles.adminBadge}>Admin - {admin.fullName}</p>

        {members.length === 0 && (
          <p className={styles.noMemberYet}>No members yet!</p>
        )}

        {members.map((member) => (
          <div key={member._id} className={styles.membersContainer}>
            <h3>{member?.user?.fullName}</h3>

            <div className={styles.memberOptions}>
              <button onClick={() => setOpenRemoveMember(member.user._id)}>
                <p>Remove</p>
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/teams/myTeamsDetails/${teamId}/members/${member.user._id}`,
                  )
                }
              >
                <p>view</p>
              </button>
            </div>

            {openRemoveMember === member.user._id && (
              <div className={styles.overlay} onClick={() => setOpenRemoveMember(null)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <h3>Remove {member.user.fullName}?</h3>
                  <button
                    className={`${styles.modalBtn} ${styles.delete}`}
                    onClick={() => handleRemoveMember(member.user._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {openTeamId && (
        <div className={styles.overlay} onClick={() => setOpenTeamId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Add Member</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <button
              className={`${styles.modalBtn} ${styles.addMember}`}
              onClick={addNewMember}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
