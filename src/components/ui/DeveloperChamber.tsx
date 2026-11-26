"use client";

import React, { useState, useEffect } from "react";
import { getSystemDiagnostics, SystemDiagnostic } from "../../lib/diagnostics";
import { Modal } from "./Modal";
import styles from "./DeveloperChamber.module.css";

export const DeveloperChamber = () => {
  const [show, setShow] = useState(false);
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostic | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "G" || e.key === "g")) {
        e.preventDefault();
        setDiagnostics(getSystemDiagnostics());
        setShow((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!diagnostics) return null;

  return (
    <Modal open={show} onClose={() => setShow(false)} labelledBy="dev-chamber-title" className={styles.chamber} closeClassName={styles.closeBtn}>
        <h2 id="dev-chamber-title" className={styles.title}>Developer Chamber</h2>
        <div className={styles.content}>
          <div className={styles.row}>
            <span className={styles.label}>Architect:</span>
            <span className={styles.value}>
              <a href="https://www.linkedin.com/in/akhmadfabiyan/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                {diagnostics.developer}
              </a>
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Project:</span>
            <span className={styles.value}>{diagnostics.project}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Framework:</span>
            <span className={styles.value}>{diagnostics.framework}</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Build Version:</span>
            <span className={styles.value}>{diagnostics.version}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Status:</span>
            <span className={styles.value}>{diagnostics.status}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Signature:</span>
            <span className={styles.value}>{diagnostics.buildSignature}</span>
          </div>
        </div>
    </Modal>
  );
};
