import React from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

interface Common {
  /** primary: gradient. secondary: white with a light border. outline: red border. ghost: text only. */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type AsButton = Common & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/** The one button style for the site. Pass `href` to render a link that looks like a button. */
export const Button: React.FC<AsButton | AsLink> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = `${styles.button} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${className}`;
  if (typeof rest.href === 'string') {
    const { href, ...a } = rest as AsLink;
    return <Link href={href} className={cls} {...a}>{children}</Link>;
  }
  return <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
};
