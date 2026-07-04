"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { BsThreeDotsVertical } from "react-icons/bs";
import styles from "../style.module.css";
import RoleOptionsOverlay from "@/components/OverLayOptions/roleOptionsOverlay";
import { notify } from "@/store/notificationStore";
import MemberOptions from "@/components/memberOptions/memberOptions";

export default function TeamAdminView({ teamId, team }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [openRemoveMember, setOpenRemoveMember] = useState(null);
  const [openTeamId, setOpenTeamId] = useState(null);
  const [optionDots, setOptionDots] = useState(false);
  const [roleChangeModal, setRoleChangeModal] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const { removeMember, addMember } = useTeamStore();

  const owner = team.owner;
  const ownerId = team.owner._id.toString();

  const members = team.members.filter((m) => m.user._id.toString() !== ownerId);

  const handleRemoveMember = async (memberId) => {
    await removeMember(teamId, memberId);
    setOpenRemoveMember(null);
  };

  const addNewMember = async () => {
    try {
      const res = await addMember(teamId, email);
      if (!res?.success) {
        setEmail("");
        setOpenTeamId(null);
        return;
      }
      setEmail("");
      setOpenTeamId(null);
    } catch (error) {
      notify("Error in adding member", "error");
    }
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

        <p className={styles.adminBadge}>Owner - {owner.fullName}</p>

        {members.length === 0 && (
          <p className={styles.noMemberYet}>No members yet!</p>
        )}

        {members.map((member) => (
          <div
            key={member._id}
            className={styles.membersContainer}
          >
            <h3 className={styles.memberName} onClick={() =>
              router.push(
                `/teams/myTeamsDetails/${teamId}/members/${member.user._id}`,
              )
            }>{member?.user?.fullName}</h3>

            <div className={styles.memberOptions}>
              <BsThreeDotsVertical
                style={{ cursor: "pointer" }}
                onClick={() => {
                  (setOptionDots(true), setMemberId(member.user._id));
                }}
              />
            </div>

            {openRemoveMember === member.user._id && (
              <div
                className={styles.overlay}
                onClick={() => setOpenRemoveMember(null)}
              >
                <div
                  className={styles.modal}
                  onClick={(e) => e.stopPropagation()}
                >
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
      {roleChangeModal && (
        <RoleOptionsOverlay
          onClose={() => setRoleChangeModal(false)}
          memberId={memberId}
          teamId={teamId}
        />
      )}
      {optionDots && (
        <MemberOptions
          onClose={() => setOptionDots(false)}
          setRoleChangeModal={setRoleChangeModal}
          setOpenRemoveMember={setOpenRemoveMember}
          memberId={memberId}
        />
      )}
    </div>
  );
}
