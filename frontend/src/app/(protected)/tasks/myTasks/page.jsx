"use client";

import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import styles from "./tasks.module.css";

export default function MyTasks() {
  return <MyTasksContent />;
}

function MyTasksContent() {
  const user = useAuthStore((s) => s.user);
  const { tasks, fetchMyTasks, loading, error } = useTaskStore();
  const router = useRouter();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  if (!user) return <div>Loading user...</div>;
  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          <div className={styles.MyTasksheading}>
            <div className={styles.MyTasks}>
              <h3>My Tasks</h3>
            </div>
            <div className={styles.noOfTasks}>
              <h4>No of Tasks {tasks.length}</h4>
            </div>
          </div>

          <div className={styles.MyTasksDetails}>
            <div className={styles.myTaskName}>
              <h4>Subject</h4>
            </div>

            <div className={styles.myTasksOptions}>
              <div className={styles.eachTasksOptions}></div>

              <div className={styles.eachTasksOptions}>Task Status</div>
            </div>
          </div>

          <div className={styles.tasksWrapper}>
            {tasks.map((task) => (
              <div key={task._id} className={styles.MyTasksDetails}>
                <div className={styles.myTasks}>
                  <h3>{task.title}</h3>
                </div>

                <div className={styles.myTasksOptions}>
                  <div className={`${styles.eachTasksOption}`}>
                    <button
                      onClick={() => {
                        router.push(`/tasks/myTasksDetails/${task._id}`);
                      }}
                      className={styles.taskDetailBtn}
                    >
                      Go to Task
                    </button>
                  </div>

                  <div className={styles.eachTasksOptionStatus}>{task.status}</div>

                  {/* <div className={styles.eachTasksOptions}>Update Status</div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
