import React from 'react';
import styles from './SectionTitle.module.css';

interface SectionTitleProps {
  title: string;
  /** Small eyebrow above the title, with the twinkling stars. */
  subtitle?: string;
  /** Supporting line below the title. */
  description?: string;
  /**
   * display: big serif title (About).
   * section: section heading, with side lines when centered (Peta Perjalanan, Berita).
   * label:   small red column heading (Quick Access, Info Garda, FAQ, Contact, Ikuti Kami).
   */
  variant?: 'display' | 'section' | 'label';
  align?: 'left' | 'center';
  className?: string;
}

/** The one heading used by every section, so headings look the same everywhere. */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  description,
  variant = 'display',
  align = 'left',
  className = '',
}) => (
  <div className={`${styles.wrapper} ${styles[variant]} ${styles[align]} ${className}`} data-reveal>
    {subtitle && (
      <span className={styles.subtitle}>
        <span className={styles.stars} aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></span>
        {subtitle}
      </span>
    )}
    <h2 className={styles.title}>{title}</h2>
    {description && <p className={styles.description}>{description}</p>}
  </div>
);
