import styles from"./styles.module.css";

export default function ButtonSpinner({ text = "Loading..." }) {
  return (
    <span className={styles.btnSpinner}>
      <span className={styles.spinner} />
      <span className={styles.text}>{text}</span>
    </span>
  );
}


