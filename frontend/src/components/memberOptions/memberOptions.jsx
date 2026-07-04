import styles from "./memberOptions.module.css";
import { cssHelper } from "@/utils/cssHelper";

const css = cssHelper(styles);

export default function MemberOptions({ onClose, setRoleChangeModal, setOpenRemoveMember, memberId}) {
  return (
    <div className={css("overlay")} onClick={onClose}>
        <div className={css("overlayBox")} onClick={(e) => e.stopPropagation()}>
          <div
            className={css("option")}
            onClick={() => setOpenRemoveMember(memberId)}
          >
            Remove
          </div>
          <div
            className={css("option")}
            onClick={() => setRoleChangeModal(true)}
          >
            Change Role
          </div>
      </div>
    </div>
  );
}
