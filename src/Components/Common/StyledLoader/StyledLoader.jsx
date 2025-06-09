import styles from "./styles.module.css";

export const StyledLoader = () => {
  return (
    <svg className={styles.pl} width={240} height={240} viewBox="0 0 240 240">
      <circle
        className={`${styles.pl__ring} ${styles["pl__ring--a"]}`}
        cx={120}
        cy={120}
        r={105}
        fill="none"
        stroke="#000"
        strokeWidth={20}
        strokeDasharray="60 600"
        strokeLinecap="round"
      />
      <circle
        className={`${styles.pl__ring} ${styles["pl__ring--b"]}`}
        cx={120}
        cy={120}
        r={35}
        fill="none"
        stroke="#000"
        strokeWidth={20}
        strokeDasharray="20 200"
        strokeLinecap="round"
      />
      <circle
        className={`${styles.pl__ring} ${styles["pl__ring--c"]}`}
        cx={85}
        cy={120}
        r={70}
        fill="none"
        stroke="#000"
        strokeWidth={20}
        strokeDasharray="40 400"
        strokeLinecap="round"
      />
      <circle
        className={`${styles.pl__ring} ${styles["pl__ring--d"]}`}
        cx={155}
        cy={120}
        r={70}
        fill="none"
        stroke="#000"
        strokeWidth={20}
        strokeDasharray="40 400"
        strokeLinecap="round"
      />
    </svg>
  );
};
