import React from "react";
import styles from "./404-error.module.css";

const Error404 = () => {
  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>404</h1>
      <p className={styles.errorMessage}>Сторінку не знайдено</p>
      <a href="/" className={styles.errorLink}>
      Повернутися на головну
      </a>
    </div>
  );
};

export default Error404;
