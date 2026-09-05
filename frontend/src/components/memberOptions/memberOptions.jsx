import { can } from "@/utils/can";
import styles from "./memberOptions.module.css";
import { cssHelper } from "@/utils/cssHelper";

const css = cssHelper(styles);

export default function MemberOptions({ onClose, setRoleChangeModal, setOpenRemoveMember, memberId }) {
  return (
    <div className={css("overlay")} onClick={onClose}>
      <div className={css("overlayBox")} onClick={(e) => e.stopPropagation()}>
        {can("member:remove") && (
          <div
            className={css("option")}
            onClick={() => setOpenRemoveMember(memberId)}
          >
            Remove
          </div>
        )}
        {can("member:role:update") && (
          <div
            className={css("option")}
            onClick={() => setRoleChangeModal(true)}
          >
            Change Role
          </div>
        )}
      </div>
    </div>
  );
}
