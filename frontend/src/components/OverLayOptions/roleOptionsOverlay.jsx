import { useEffect, useState } from "react";
import styles from "./roleOptions.module.css";
import { cssHelper } from "@/utils/cssHelper";
import { useRoleStore } from "@/store/roleStore";
import { RxCross2 } from "react-icons/rx";

const css = cssHelper(styles);

export default function RoleOptionsOverlay({ onClose, memberId, teamId }) {
  const [requestedRoleId, setRequestedRoleId] = useState(null);
  const { getRolesForTeam, teamRoles, assignRole } = useRoleStore();


  const handleAssignRole = async () => {
    await assignRole(teamId, memberId, requestedRoleId);
  };


  useEffect(() => {
    getRolesForTeam(teamId);
  }, [teamId]);

  return (
    <div className={css("overlay")}>
      <div className={css("overlayBox")} onClick={(e) => e.stopPropagation()}>
        <div className={css("close-icon")} onClick={onClose}><RxCross2 /></div>

        <h3 className={css("title")}>Select a Role</h3>

        <div className={css("roleList")}>
          {teamRoles && teamRoles.map((role) => (
            <div
              key={role._id}
              className={css("option", {
                selected: requestedRoleId === role._id,
              })}
              onClick={() => setRequestedRoleId(role._id)}
            >
              <span className={css("roleName")}>{role.name}</span>
            </div>
          ))}
        </div>

        <div
          className={css("option", "done")}
          onClick={async () => {
            await handleAssignRole();
            onClose();
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
}
