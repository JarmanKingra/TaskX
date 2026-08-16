import React from 'react';
import styles from './styles.module.css';
import { cssHelper } from '@/utils/cssHelper';
import { useRouter } from 'next/navigation';

const css = cssHelper(styles);

export default function Cta() {
    const router = useRouter();
    return (
        <section className={css("section")}>
            <div className={css("container")}>
                <div className={css("banner")}>
                    <div className={css("topGlow")} />
                    <div className={css("bottomGlow")} />

                    <div className={css("content")}>
                        <h2 className={css("title")}>Ready to get started?</h2>
                        <p className={css("description")}>
                            Join thousands of teams already using TaskX to ship faster and stay organized.
                        </p>

                        <div className={css("buttonGroup")}>
                            <a className={css("primaryBtn")} onClick={() => { router.push("/auth/register") }}>
                                Start for free
                            </a>
                            <a className={css("secondaryBtn")} onClick={() => { router.push("/auth/login") }}>
                                Talk to sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}