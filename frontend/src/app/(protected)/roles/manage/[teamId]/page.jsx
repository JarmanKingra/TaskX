"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRoleStore } from "@/store/roleStore";
import styles from "./styles.module.css";
import { MdAssignmentInd } from "react-icons/md";
import { cssHelper } from "@/utils/cssHelper";
import { useTeamStore } from "@/store/teamStore";
import { RxCross2 } from "react-icons/rx";

const css = cssHelper(styles);

export default function ManageRoles() {
    const router = useRouter();
    const { teamId } = useParams();
    const {
        getRolesForTeam,
        teamRoles,
        deleteRoleById,
        loading,
        assignRole,
        getPermissions,
        permissions: permissionCatalog,
        createNewRole,
    } = useRoleStore();
    const { fetchTeamById, currTeam } = useTeamStore();
    const [assigningRoleId, setAssigningRoleId] = useState(null);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const [openCreateRole, setOpenCreateRole] = useState(false);
    const [roleName, setRoleName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionPopupOpen, setPermissionPopupOpen] = useState(false);
    const [permissionDraft, setPermissionDraft] = useState([]);

    useEffect(() => {
        if (teamId) {
            getRolesForTeam(teamId);
            fetchTeamById(teamId);
        }
        getPermissions();
    }, [teamId]);

    const ownerId = currTeam?.owner?._id?.toString();
    const assignableMembers = (currTeam?.members || []).filter((member) => {
        const userId = member?.user?._id?.toString();
        return userId && userId !== ownerId;
    });

    const closeAssignOverlay = () => {
        setAssigningRoleId(null);
        setSelectedMemberId(null);
    };

    const handleAssignToMember = async () => {
        if (!selectedMemberId || !assigningRoleId) return;
        const result = await assignRole(teamId, selectedMemberId, assigningRoleId);
        if (result?.success === false) return;
        closeAssignOverlay();
    };

    const closeCreateRole = () => {
        setOpenCreateRole(false);
        setPermissionPopupOpen(false);
        setPermissionDraft([]);
        setRoleName("");
        setDescription("");
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

    const handleCreateRole = async () => {
        const result = await createNewRole(
            teamId,
            roleName,
            description,
            selectedPermissions.map((permission) => permission._id),
        );
        if (result?.success === false) return;
        closeCreateRole();
    };

    if (loading && (!teamRoles || teamRoles.length === 0)) {
        return (
            <div className={css("manageRoles")}>
                <div className={css("loadingWrapper")}>
                    <div className={css("loader")}></div>
                    <p className={css("loadingText")}>Loading roles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={css("manageRoles")}>
            <div className={css("container")}>
                <header className={css("header")}>
                    <div className={css("titleArea")}>
                        <h1 className={css("title")}>Manage Roles</h1>
                        <span className={css("teamBadge")}>
                            {teamRoles?.length || 0} {(teamRoles?.length || 0) === 1 ? "role" : "roles"}
                        </span>
                    </div>
                    <button
                        type="button"
                        className={css("createRoleButton")}
                        onClick={() => setOpenCreateRole(true)}
                    >
                        Create Role
                    </button>
                </header>

                <div className={css("rolesContainer")}>
                    {teamRoles?.length > 0 ? (
                        teamRoles.map((role) => (
                            <div key={role._id} className={css("roleCard")}>
                                <div className={css("cardHeader")}>
                                    <div className={css("roleNameArea")}>
                                        <h2 className={css("roleName")}>{role.name}</h2>
                                        <div
                                            className={css("assignRoleArea")}
                                            onClick={() => {
                                                setSelectedMemberId(null);
                                                setAssigningRoleId(role._id);
                                            }}
                                        >
                                            <MdAssignmentInd className={css("assignRoleIcon")} />
                                            <button type="button" className={css("assignRole")}>
                                                Assign Role
                                            </button>
                                        </div>
                                    </div>

                                    <p className={css("roleDescription")}>
                                        {role.description || "No description for this role."}
                                    </p>
                                </div>

                                {role.permissions?.length > 0 ? (
                                    <>
                                        <p className={css("permissionChips")}>
                                            {role.permissions
                                                .map((permission) => permission.name || permission)
                                                .join(" · ")}
                                        </p>
                                    </>
                                ) : (
                                    <p className={css("permissionEmpty")}>No permissions assigned</p>
                                )}

                                <div className={css("roleActions")}>
                                    <button
                                        type="button"
                                        className={css("editRole")}
                                        onClick={() => router.push(`/roles/manage/singleRole?teamId=${teamId}&roleId=${role._id}`)}
                                    >
                                        Go to Role
                                    </button>
                                    <button
                                        type="button"
                                        className={css("deleteRole")}
                                        onClick={() => deleteRoleById(teamId, role._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={css("noRoles")}>No roles found for this team.</p>
                    )}
                </div>
            </div>

            {assigningRoleId && (
                <div className={css("overlay")} onClick={closeAssignOverlay}>
                    <div className={css("overlayBox")} onClick={(e) => e.stopPropagation()}>
                        <div className={css("closeIcon")} onClick={closeAssignOverlay}>
                            <RxCross2 />
                        </div>
                        <h3 className={css("overlayTitle")}>Assign to member</h3>
                        <div className={css("memberList")}>
                            {assignableMembers.length > 0 ? (
                                assignableMembers.map((member) => (
                                    <button
                                        type="button"
                                        key={member.user._id}
                                        className={css("memberOption", {
                                            memberOptionSelected:
                                                selectedMemberId === member.user._id.toString(),
                                        })}
                                        onClick={() => setSelectedMemberId(member.user._id.toString())}
                                    >
                                        {member.user.fullName}
                                    </button>
                                ))
                            ) : (
                                <p className={css("noMembers")}>No members to assign.</p>
                            )}
                        </div>
                        <button
                            type="button"
                            className={css("overlayAssignBtn")}
                            disabled={!selectedMemberId}
                            onClick={handleAssignToMember}
                        >
                            Assign
                        </button>
                    </div>
                </div>
            )}

            {openCreateRole && (
                <div className={css("overlay")} onClick={closeCreateRole}>
                    <div className={css("overlayBox", "createRoleModal")} onClick={(e) => e.stopPropagation()}>
                        <h3 className={css("overlayTitle")}>Create Role</h3>
                        <input
                            className={css("modalInput")}
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Role Name"
                        />
                        <div className={css("inputGroup")}>
                            <label htmlFor="role-description" className={css("label")}>
                                Description (Optional)
                            </label>
                            <textarea
                                id="role-description"
                                className={css("textarea")}
                                placeholder="What is this role for?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        {selectedPermissions.length > 0 && (
                            <div className={css("selectedPermissionChips")}>
                                {selectedPermissions.map((picked) => (
                                    <span key={picked._id} className={css("permissionChip")}>
                                        {picked.name}
                                        <button
                                            type="button"
                                            className={css("permissionChipRemove")}
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
                            className={css("selectPermission")}
                            onClick={openPermissionPopup}
                        >
                            {selectedPermissions.length > 0
                                ? `${selectedPermissions.length} permission${selectedPermissions.length === 1 ? "" : "s"} selected`
                                : "Select Permissions"}
                        </button>
                        <button
                            type="button"
                            className={css("overlayAssignBtn")}
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
                        className={css("overlayBox", "permissionPopup")}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={css("overlayTitle")}>Select Permissions</h3>
                        <p className={css("permissionPopupHint")}>
                            Choose every permission this role should have, then apply.
                        </p>
                        <div className={css("permissionPopupActions")}>
                            <button
                                type="button"
                                className={css("secondaryBtn")}
                                onClick={() => setPermissionDraft(permissionCatalog)}
                            >
                                Select all
                            </button>
                            <button
                                type="button"
                                className={css("secondaryBtn")}
                                onClick={() => setPermissionDraft([])}
                            >
                                Clear
                            </button>
                        </div>
                        <ul className={css("permissionPickList")}>
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
                                            <span className={css("permissionRowText")}>
                                                <span className={css("permissionRowName")}>{item.name}</span>
                                                {item.description && (
                                                    <span className={css("permissionRowDesc")}>
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
                            className={css("overlayAssignBtn")}
                            onClick={applyPermissionDraft}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
