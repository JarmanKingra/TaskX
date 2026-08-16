import React from 'react';
import styles from './styles.module.css';
import { cssHelper } from '@/utils/cssHelper';
import { useRouter } from 'next/navigation';

const css = cssHelper(styles);

export default function Footer() {
    const router = useRouter();
  return (
    <footer className={css("footer")}>
      <div className={css("container")}>
        <div className={css("flexWrapper")}>
          <div className={css("brandGroup")}>
            <svg
              className={css("icon")}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 11l3 3L22 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={css("brandTitle")} onClick={() => { router.push("/") }}>TaskX</span>
          </div>
          <p className={css("copyright")}>
            &copy; 2026 TaskX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}