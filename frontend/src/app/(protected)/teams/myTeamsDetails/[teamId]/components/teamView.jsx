"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { BsThreeDotsVertical } from "react-icons/bs";
import styles from "./adminStyles.module.css";
import RoleOptionsOverlay from "@/components/OverLayOptions/roleOptionsOverlay";
import { notify } from "@/store/notificationStore";
import MemberOptions from "@/components/memberOptions/memberOptions";
import { can } from "@/utils/can";
import { useAuthStore } from "@/store/authStore";
import ButtonSpinner from "@/components/loaders/longSpinnerLoader";

export default function TeamView({ setSubComponent, teamId, team }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [openRemoveMember, setOpenRemoveMember] = useState(null);
  const [openTeamId, setOpenTeamId] = useState(null);
  const [optionDots, setOptionDots] = useState(false);
  const [roleChangeModal, setRoleChangeModal] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const [navigationLoading, setNavigationLoading] = useState(null);
  const { removeMember, addMember } = useTeamStore();
  const owner = team.owner;
  const ownerId = team.owner._id.toString();
  const user = useAuthStore((s) => s.user);
  const userId = user.id;

  const members = team.members.filter((m) => m.user._id.toString() !== ownerId);

  const isMe = (memberId) => {
    return userId.toString() === memberId.toString();
  }

  const handleRemoveMember = async (memberId) => {
    await removeMember(teamId, memberId);
    setOpenRemoveMember(null);
  };

  function handleNavigation(path, id) {
    setNavigationLoading(id);
    router.push(path);
  }

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
            <div className={styles.mainHeadingOptionsButtons}>
              {can("role:manage") && <button
                onClick={() => handleNavigation(`/roles/manage/${teamId}`, "ManageRole")}
                disabled={navigationLoading === "ManageRole"}
                className={styles.optionsButton}
              >
                {navigationLoading === "ManageRole" ? <ButtonSpinner text="Loading..." /> : <><span>Manage Roles</span></>}
              </button>}
              {can("member:add") && (<button onClick={() => setOpenTeamId(teamId)} className={styles.optionsButton}>Add Member</button>)}
            </div>
          </div>
        </div>

        <div className={styles.adminBadges}>
          <p className={styles.adminBadge}>Owner - {owner.fullName}</p>
          <p className={styles.myTasksButton} onClick={() => setSubComponent("myTasks")}>My Tasks</p>
        </div>
        {members.length === 0 && (
          <p className={styles.noMemberYet}>No members yet!</p>
        )}

        {members.map((member) => (
          <div key={member._id} className={styles.membersContainer}>
            <div className={styles.nameAndRoleContainer}>
              <h3
                className={styles.memberName}

                onClick={() => {
                  if (can("task:view:all")) {
                    handleNavigation(
                      `/teams/myTeamsDetails/${teamId}/members/${member.user._id}`,
                      member.user._id
                    );
                  }
                }
                }
              >
                {isMe(member.user._id) ?
                  <span className={styles.meBadgeYou}>You</span>
                  :
                  navigationLoading === member.user._id ? <ButtonSpinner text="Loading..." /> : member?.user?.fullName
                }
              </h3>

              <div className={styles.memberRole}>{member?.role?.name}</div>
            </div>

            <div className={styles.memberOptions}>
              <BsThreeDotsVertical
                style={{ cursor: "pointer" }}
                onClick={() => {
                  (setOptionDots(true), setMemberId(member.user._id));
                }}
              />
            </div>
          </div>
        ))}
      </div>


      {openRemoveMember && (
        <div
          className={styles.overlay}
          onClick={() => setOpenRemoveMember(null)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              Remove{" "}
              {
                members.find(
                  (m) => m.user._id === openRemoveMember
                )?.user.fullName
              }?
            </h3>

            <button
              className={`${styles.modalBtn} ${styles.delete}`}
              onClick={() => handleRemoveMember(openRemoveMember)}
            >
              Remove
            </button>
          </div>
        </div>
      )}

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
      {optionDots && (can("member:remove") || can("member:role:update")) && (
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
