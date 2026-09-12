import React from 'react';
import styles from './styles.module.css';
import { cssHelper } from '@/utils/cssHelper';
import { useRouter } from 'next/navigation';

const css = cssHelper(styles);

export default function Hero1() {

    const router = useRouter();
    return (
        <section className={css('hero')}>
            <div className={css('bgGradientOverlay')} />
            <div className={css('bgGlowSpot')} />

            <div className={css('container')}>
                <div className={css('grid')}>
                    {/* Left Content Column */}
                    <div className={css('contentCol')}>
                        <p className={css('subtitle')}>Manage Tasks</p>
                        <h1 className={css('title')}>
                            <span className={css('blockSpan')}>Effortlessly</span>
                            <span className={css('blockSpanWithMargin')}>
                                with <span className={css('highlightText')}>TaskX</span>
                            </span>
                        </h1>

                        <p className={css('description')}>
                            A powerful task management platform built for teams who want clarity,
                            speed, and collaboration.
                        </p>

                        <form className={css('form')} onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Your work email"
                                className={css('input')}
                            />
                            <button type="submit" className={css('submitBtn')} onClick={() => { router.push("/auth/register") }}>
                                Start for free
                            </button>
                        </form>

                        <p className={css('subtext')}>
                            No credit card required · Free forever for individuals
                        </p>
                    </div>

                    {/* Right Preview Card Column */}
                    <div className={css('cardCol')}>
                        <div className={css('cardWrapper')}>
                            <div className={css('cardGlow')} />
                            <div className={css('card')}>
                                <div className={css('cardHeader')}>
                                    <h3 className={css('cardTitle')}>Today's Tasks</h3>
                                    <span className={css('badge')}>4 remaining</span>
                                </div>

                                <div className={css('taskList')}>
                                    {/* Task 1 */}
                                    <div className={css('taskItem')}>
                                        <div className={css('checkboxCompleted')}>
                                            <svg
                                                className={css('checkboxIcon')}
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span className={css('taskTextCompleted')}>
                                            Review design mockups
                                        </span>
                                    </div>

                                    {/* Task 2 */}
                                    <div className={css('taskItem')}>
                                        <div className={css('checkboxUnchecked')} />
                                        <span className={css('taskText')}>Finalize Q1 roadmap</span>
                                        <span className={css('priorityBadge')}>High</span>
                                    </div>

                                    {/* Task 3 */}
                                    <div className={css('taskItem')}>
                                        <div className={css('checkboxUnchecked')} />
                                        <span className={css('taskText')}>Team sync meeting</span>
                                        <span className={css('timeBadge')}>2:00 PM</span>
                                    </div>

                                    {/* Task 4 */}
                                    <div className={css('taskItem')}>
                                        <div className={css('checkboxUnchecked')} />
                                        <span className={css('taskText')}>Update documentation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
