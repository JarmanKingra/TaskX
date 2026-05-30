import { useState } from "react";
import styles from "./roleOptions.module.css";
import { cssHelper } from "@/utils/cssHelper";
import { useTeamStore } from "@/store/teamStore";

const css = cssHelper(styles);

export default function RoleOptionsOverlay({ onClose, memberId, teamId }) {
  const [requestedRole, setRequestedRole] = useState(null);
  const { updateTeamMemberRole } = useTeamStore();

  const handleUpdateUserRole = async (teamId, memberId, requestedRole) => {
    await updateTeamMemberRole(teamId, memberId, requestedRole);
  };

  return (
    <div className={css("overlay")} onClick={onClose}>
      <div className={css("overlayBox")} onClick={(e) => e.stopPropagation()}>
        <div
          className={css("option", {
            selected: requestedRole === "admin",
          })}
          onClick={() => setRequestedRole("admin")}
        >
          Set as Admin
        </div>

        <div
          className={css("option", {
            selected: requestedRole === "member",
          })}
          onClick={() => setRequestedRole("member")}
        >
          Set as Member
        </div>

        <div
          className={css("option", "done")}
          onClick={async () => {
            await handleUpdateUserRole(teamId, memberId, requestedRole);
            onClose();
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
}
