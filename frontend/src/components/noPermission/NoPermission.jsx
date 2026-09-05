
import Styles from "./NoPermission.module.css";
import { cssHelper } from "@/utils/cssHelper";

const css = cssHelper(Styles);

export default function NoPermission({
  message = "You don't have permission to access this resource.",
}) {
  return (
    <div className={css("noPermission")}>
      <div className={css("icon")}>🔒</div>

      <h3 className={css("title")}>Access Restricted</h3>

      <p className={css("message")} >{message}</p>
    </div>
  );
}