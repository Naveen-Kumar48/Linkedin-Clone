import React from "react";
import styles from "./index.module.css"
export default function DashboardLayout({ children }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.homeContainer}>

          <div className={styles.homeContainer__leftBar}>

          </div>

          <div className={styles.homeContainer__feedContainer}>{children}</div>

          <div className={styles.homeContainer__extraContainer}></div>
        </div>


      </div>
    </>
  );
}
