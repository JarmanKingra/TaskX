import { useState } from "react";
import styles from "./roleOptions.module.css";
import { useTeamStore } from "@/store/teamStore";

export default function RoleOptionsOverlay({ onClose, memberId, teamId }) {
  const [requestedRole, setRequestedRole] = useState(null);
  const { updateTeamMemberRole } = useTeamStore();

  const handleUpdateUserRole = async (teamId, requestedRole, memberId) => {
    await updateTeamMemberRole(teamId, memberId, requestedRole);
  };

  return (
    <div className={styles.overlay} onClick={() => onClose()}>
      <div className={styles.overlayBox} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.option}
          onClick={() => setRequestedRole("admin")}
        >
          Set as Admin
        </div>
        <div className={styles.option} onClick={() => setRequestedRole("user")}>
          Set as User
        </div>
        <div
          className={`${styles.option} ${styles.done}`}
          onClick={async () => {
            await updateTeamMemberRole(teamId, memberId, requestedRole);
            onClose();
          }}
        >
          Done
        </div>
      </div>
    </div>
  );
}
