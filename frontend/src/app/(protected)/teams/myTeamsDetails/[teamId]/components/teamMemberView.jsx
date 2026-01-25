"use client";

import styles from "../../../../tasks/myTasks/tasks.module.css";

export default function TeamMemberView({ tasks, onOpenTask }) {
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
              <h4>No of Tasks {tasks.length}</h4>
            </div>
          </div>

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
                      onClick={() => onOpenTask(task._id)}
                      className={styles.taskDetailBtn}
                    >
                      Go to Task
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
