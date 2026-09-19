"use client";

import ButtonSpinner from "@/components/loaders/longSpinnerLoader";
import styles from "./MyTasks.module.css";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";


export default function MyTasksComponent({ setSubComponent, tasks, onOpenTask }) {
    const pathname = usePathname();
    const [navigationLoading, setNavigationLoading] = useState(null);
    const router = useRouter();
    function handleNavigation(path, id) {
        setNavigationLoading(id);
        router.push(path);
    }

    if (!tasks) return null;



    return (
        <>
            <div className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.MyTasksheading}>
                        <div className={styles.MyTasks}>
                            <h3>My Tasks</h3>
                        </div>
                        <div className={styles.noOfTasks}>
                            <h4>No of Tasks - {tasks?.length}</h4>
                        </div>
                    </div>

                    {!pathname.includes("/tasks/myTasks") &&
                        (<p
                            className={styles.goToTeamButton} onClick={() => setSubComponent("teamView")}>
                            Go to Team
                        </p>)}

                    {tasks.length === 0 ? (
                        <p className={styles.empty}>No tasks assigned yet.</p>
                    ) : (
                        <div className={styles.MyTasksDetails}>
                            <div className={styles.myTaskName}>
                                <h4>Subject</h4>
                            </div>

                            <div className={styles.myTasksOptions}>
                                <div className={styles.eachTasksOptions}></div>

                                <div className={styles.eachTasksOptions}>Task Status</div>
                            </div>
                        </div>
                    )}

                    <div className={styles.tasksWrapper}>
                        {tasks.map((task) => (
                            <div key={task._id} className={styles.MyTasksDetails}>
                                <div className={styles.myTasks}>
                                    <h3>{task.title}</h3>
                                </div>

                                <div className={styles.myTasksOptions}>
                                    <div className={`${styles.eachTasksOption}`}>
                                        <button
                                            onClick={() => handleNavigation(`/tasks/myTasksDetails/${task._id}`, task._id)}
                                            disabled={navigationLoading === task._id}
                                            className={styles.taskDetailBtn}
                                        >
                                            {navigationLoading === task._id ? <ButtonSpinner text="Loading..." /> : <><span>Go to Task</span></>}
                                        </button>
                                    </div>

                                    <div className={styles.eachTasksOptionStatus}>
                                        {task.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
