import React from 'react';
import styles from './styles.module.css';
import { cssHelper } from '@/utils/cssHelper';

const css = cssHelper(styles);

export default function Features() {
    return (
        <section className={css("section")}>
            <div className={css("container")}>
                <div className={css("header")}>
                    <p className={css("subtitle")}>Why TaskX</p>
                    <h2 className={css("title")}>Built for modern teams</h2>
                </div>

                <div className={css("grid")}>
                    {/* Card 1 */}
                    <div className={css("card")}>
                        <div className={css("iconBox")}>
                            <svg
                                className={css("icon")}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                                />
                            </svg>
                        </div>
                        <h3 className={css("cardTitle")}>Lightning fast</h3>
                        <p className={css("cardDescription")}>
                            Instant updates, real-time sync, and zero lag. Your workflow never waits.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className={css("card")}>
                        <div className={css("iconBox")}>
                            <svg
                                className={css("icon")}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.1981.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.747 3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                                />
                            </svg>
                        </div>
                        <h3 className={css("cardTitle")}>Team collaboration</h3>
                        <p className={css("cardDescription")}>
                            Comments, mentions, and shared views keep everyone aligned and productive.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className={css("card")}>
                        <div className={css("iconBox")}>
                            <svg
                                className={css("icon")}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12.75L11.25 15 15 9.75M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"
                                />
                            </svg>
                        </div>
                        <h3 className={css("cardTitle")}>Enterprise security</h3>
                        <p className={css("cardDescription")}>
                            Bank-level encryption, SSO, and compliance certifications you can trust.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}