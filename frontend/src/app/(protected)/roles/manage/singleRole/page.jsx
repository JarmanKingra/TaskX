"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRoleStore } from "@/store/roleStore";
import styles from "./styles.module.css";
import { cssHelper } from "@/utils/cssHelper";

const css = cssHelper(styles);

const SingleRolePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("roleId");
  const teamId = searchParams.get("teamId");
  const [updatedPermissions, setUpdatedPermissions] = useState([]);
  const [permissionPopupOpen, setPermissionPopupOpen] = useState(false);
  const [permissionDraft, setPermissionDraft] = useState([]);
  const {
    getRoleById,
    getPermissions,
    permissions: permissionCatalog,
    error,
    currRole,
    updateRoleById,
  } = useRoleStore();

  useEffect(() => {
    if (roleId && teamId) getRoleById(teamId, roleId);
    getPermissions();
  }, [roleId, teamId]);

  useEffect(() => {
    if (currRole) {
      setUpdatedPermissions(currRole.permissions || []);
    }
  }, [currRole]);

  const persistPermissions = async (nextPermissions) => {
    setUpdatedPermissions(nextPermissions);
    await updateRoleById(
      teamId,
      roleId,
      currRole?.name,
      currRole?.description,
      nextPermissions.map((p) => p._id),
    );
  };

  const handleRemovePermission = async (permissionId) => {
    await persistPermissions(
      updatedPermissions.filter((p) => p._id !== permissionId),
    );
  };

  const availablePermissions = (permissionCatalog || []).filter(
    (item) => !updatedPermissions.some((picked) => picked._id === item._id),
  );

  const openPermissionPopup = () => {
    setPermissionDraft([]);
    setPermissionPopupOpen(true);
  };

  const toggleDraftPermission = (item) => {
    setPermissionDraft((prev) =>
      prev.some((picked) => picked._id === item._id)
        ? prev.filter((picked) => picked._id !== item._id)
        : [...prev, item],
    );
  };

  const isDraftSelected = (permissionId) =>
    permissionDraft.some((picked) => picked._id === permissionId);

  const applyPermissionDraft = async () => {
    if (permissionDraft.length === 0) {
      setPermissionPopupOpen(false);
      return;
    }
    await persistPermissions([...updatedPermissions, ...permissionDraft]);
    setPermissionDraft([]);
    setPermissionPopupOpen(false);
  };

  if (!currRole) {
    return (
      <div className={css("singleRolePage")}>
        <div className={css("loadingWrapper")}>
          <div className={css("loader")}></div>
          <p className={css("loadingText")}>Loading role...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={css("singleRolePage")}>
        <div className={css("loadingWrapper")}>
          <p className={css("errorText")}>{error}</p>
        </div>
      </div>
    );
  }

  const permissions = updatedPermissions || [];

  return (
    <div className={css("singleRolePage")}>
      <div className={css("container")}>
        <header className={css("header")}>
          <div className={css("titleArea")}>
            <h1 className={css("roleName")}>{currRole.name}</h1>
            <span className={css("teamBadge")}>
              {permissions.length}{" "}
              {permissions.length === 1 ? "permission" : "permissions"}
            </span>
          </div>
          <button
            type="button"
            className={css("backButton")}
            onClick={() => router.push(`/roles/manage/${teamId}`)}
          >
            Back to roles
          </button>
        </header>

        <section className={css("detailsCard")}>
          <p className={css("label")}>Description</p>
          <p className={css("roleDescription")}>
            {currRole.description || "No description for this role."}
          </p>
        </section>

        <section className={css("rolePermissions")}>
          <div className={css("permissionHeader")}>
            <h2 className={css("permissionTitle")}>Permissions</h2>
            <button
              type="button"
              className={css("addPermissionBtn")}
              onClick={openPermissionPopup}
              disabled={availablePermissions.length === 0}
            >
              Add permission
            </button>
          </div>
          {permissions.length > 0 ? (
            <div className={css("permissionList")}>
              {permissions.map((permission) => (
                <div key={permission._id} className={css("permissionItem")}>
                  <div>
                    <p className={css("permissionName")}>{permission.name}</p>
                    <p className={css("permissionDescription")}>
                      {permission.description || "No description"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={css("removePermissionBtn")}
                    onClick={() => handleRemovePermission(permission._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={css("noPermissions")}>
              No permissions assigned to this role.
            </p>
          )}
        </section>
      </div>

      {permissionPopupOpen && (
        <div
          className={css("overlay")}
          onClick={() => setPermissionPopupOpen(false)}
        >
          <div
            className={css("overlayBox")}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={css("overlayTitle")}>Add Permissions</h3>
            <p className={css("permissionPopupHint")}>
              Only permissions not already on this role are shown.
            </p>
            <div className={css("permissionPopupActions")}>
              <button
                type="button"
                className={css("secondaryBtn")}
                onClick={() => setPermissionDraft(availablePermissions)}
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
              {availablePermissions.length > 0 ? (
                availablePermissions.map((item) => {
                  const checked = isDraftSelected(item._id);
                  return (
                    <li key={item._id}>
                      <button
                        type="button"
                        className={css("permissionRow", {
                          permissionRowSelected: checked,
                        })}
                        onClick={() => toggleDraftPermission(item)}
                      >
                        <span
                          className={css("permissionCheck", {
                            permissionCheckOn: checked,
                          })}
                        >
                          {checked ? "✓" : ""}
                        </span>
                        <span className={css("permissionRowText")}>
                          <span className={css("permissionRowName")}>
                            {item.name}
                          </span>
                          {item.description && (
                            <span className={css("permissionRowDesc")}>
                              {item.description}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className={css("permissionPopupHint")}>
                  This role already has every permission.
                </li>
              )}
            </ul>
            <button
              type="button"
              className={css("overlayAssignBtn")}
              disabled={permissionDraft.length === 0}
              onClick={applyPermissionDraft}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleRolePage;
