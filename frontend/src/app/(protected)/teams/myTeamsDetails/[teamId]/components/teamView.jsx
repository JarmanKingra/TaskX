"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTeamStore } from "@/store/teamStore";
import { BsThreeDotsVertical } from "react-icons/bs";
import styles from "./adminStyles.module.css";
import RoleOptionsOverlay from "@/components/OverLayOptions/roleOptionsOverlay";
import { notify } from "@/store/notificationStore";
import MemberOptions from "@/components/memberOptions/memberOptions";
import { can } from "@/utils/can";
import { useAuthStore } from "@/store/authStore";
import { useRoleStore } from "@/store/roleStore";
import { cssHelper } from "@/utils/cssHelper";

const css = cssHelper(styles);

export default function TeamView({ setSubComponent, teamId, team }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [roleName, setRoleName] = useState("");
  const [openRemoveMember, setOpenRemoveMember] = useState(null);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [openTeamId, setOpenTeamId] = useState(null);
  const [optionDots, setOptionDots] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionPopupOpen, setPermissionPopupOpen] = useState(false);
  const [permissionDraft, setPermissionDraft] = useState([]);
  const [roleChangeModal, setRoleChangeModal] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const { removeMember, addMember } = useTeamStore();
  const { getPermissions, permissions: permissionCatalog, loading: roleLoading, error, createNewRole } = useRoleStore();
  const [description, setDescription] = useState("");
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

  const handleCreateRole = async () => {
    try {
      await createNewRole(teamId, roleName, description, selectedPermissions.map((permission) => permission._id));
    } catch (error) {
      notify("Error in creating role", "error");
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const closeCreateRole = () => {
    setOpenCreateRole(false);
    setPermissionPopupOpen(false);
    setPermissionDraft([]);
    setRoleName("");
    setSelectedPermissions([]);
  };

  const openPermissionPopup = () => {
    setPermissionDraft(selectedPermissions);
    setPermissionPopupOpen(true);
  };

  const toggleDraftPermission = (item) => {
    setPermissionDraft((prev) =>
      prev.some((picked) => picked._id === item._id)
        ? prev.filter((picked) => picked._id !== item._id)
        : [...prev, item],
    );
  };

  const applyPermissionDraft = () => {
    setSelectedPermissions(permissionDraft);
    setPermissionPopupOpen(false);
  };

  const isDraftSelected = (permissionId) =>
    permissionDraft.some((picked) => picked._id === permissionId);

  const removeSelectedPermission = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.filter((item) => item._id !== permissionId),
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.mainHeading}>
          <div className={styles.mainHeadingOptions}>
            <h3>Team Members</h3>
            {can("member:add") && (<button onClick={() => setOpenTeamId(teamId)}>Add Member</button>)}
            <button onClick={() => setOpenCreateRole(true)}>Create Role</button>
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
                    router.push(
                      `/teams/myTeamsDetails/${teamId}/members/${member.user._id}`,
                    )
                  }
                }
                }
              >
                {isMe(member.user._id) ?
                  <span className={styles.meBadgeYou}>You</span>
                  :
                  member?.user?.fullName
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

            {openRemoveMember === member.user._id && can("member:remove") && (

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

      {openCreateRole && (
        <div className={styles.overlay} onClick={closeCreateRole}>
          <div
            className={css("modal")}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create Role</h3>
            <input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Role Name"
            />

            <div className={styles.inputGroup}>
              <label htmlFor="description" className={styles.label}>
                Description (Optional)
              </label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="What is this team working on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={roleLoading}
                required
                rows={3}
              />
            </div>

            {selectedPermissions.length > 0 && (
              <div className={styles.selectedPermissionChips}>
                {selectedPermissions.map((picked) => (
                  <span key={picked._id} className={styles.permissionChip}>
                    {picked.name}
                    <button
                      type="button"
                      className={styles.permissionChipRemove}
                      onClick={() => removeSelectedPermission(picked._id)}
                      aria-label={`Remove ${picked.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <button
              type="button"
              className={styles.selectPermission}
              onClick={openPermissionPopup}
            >
              {selectedPermissions.length > 0
                ? `${selectedPermissions.length} permission${selectedPermissions.length === 1 ? "" : "s"} selected`
                : "Select Permissions"}
            </button>
            <button
              className={`${styles.modalBtn} ${styles.addMember}`}
              onClick={handleCreateRole}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {permissionPopupOpen && (
        <div
          className={css("overlay", "permissionOverlay")}
          onClick={() => setPermissionPopupOpen(false)}
        >
          <div
            className={css("modal", "permissionPopup")}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Select Permissions</h3>
            <p className={styles.permissionPopupHint}>
              Choose every permission this role should have, then apply.
            </p>
            <div className={styles.permissionPopupActions}>
              <button
                type="button"
                className={`${styles.modalBtn} ${styles.secondary}`}
                onClick={() => setPermissionDraft(permissionCatalog)}
              >
                Select all
              </button>
              <button
                type="button"
                className={`${styles.modalBtn} ${styles.secondary}`}
                onClick={() => setPermissionDraft([])}
              >
                Clear
              </button>
            </div>
            <ul className={styles.permissionList}>
              {permissionCatalog.map((item) => {
                const checked = isDraftSelected(item._id);
                return (
                  <li key={item._id}>
                    <button
                      type="button"
                      className={css("permissionRow", { permissionRowSelected: checked })}
                      onClick={() => toggleDraftPermission(item)}
                    >
                      <span className={css("permissionCheck", { permissionCheckOn: checked })}>
                        {checked ? "✓" : ""}
                      </span>
                      <span className={styles.permissionRowText}>
                        <span className={styles.permissionRowName}>{item.name}</span>
                        {item.description && (
                          <span className={styles.permissionRowDesc}>
                            {item.description}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className={`${styles.modalBtn} ${styles.addMember}`}
              onClick={applyPermissionDraft}
            >
              Apply
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
