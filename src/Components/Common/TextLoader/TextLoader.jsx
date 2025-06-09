import React from "react";
import styles from "./styles.module.css";
export const TextLoader = ({ words }) => {
  return (
    <div className={styles.card}>
      <div className={styles.loader}>
        <p>loading</p>
        <div className={styles.words}>
          {words.map((word) => {
            return <span className="word">buttons</span>;
          })}

          <span className="word">forms</span>
          <span className="word">switches</span>
          <span className="word">cards</span>
          <span className="word">buttons</span>
        </div>
      </div>
    </div>
  );
};
