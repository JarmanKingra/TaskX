"use client";

import { useEffect } from "react";
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
  const { getRoleById, loading, error, currRole } = useRoleStore();

  useEffect(() => {
    if (roleId && teamId) getRoleById(teamId, roleId);
  }, [roleId, teamId]);

  if (loading) {
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

  if (!currRole) {
    return (
      <div className={css("singleRolePage")}>
        <div className={css("loadingWrapper")}>
          <p className={css("loadingText")}>Role not found.</p>
        </div>
      </div>
    );
  }

  const permissions = currRole.permissions || [];

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
          <h2 className={css("permissionTitle")}>Permissions</h2>
          {permissions.length > 0 ? (
            <div className={css("permissionList")}>
              {permissions.map((permission) => (
                <div key={permission._id} className={css("permissionItem")}>
                  <p className={css("permissionName")}>{permission.name}</p>
                  <p className={css("permissionDescription")}>
                    {permission.description || "No description"}
                  </p>
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
    </div>
  );
};

export default SingleRolePage;
