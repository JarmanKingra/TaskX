"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { FaTrash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import styles from "./style.module.css";
import { can } from "@/utils/can";
import NoPermission from "@/components/noPermission/NoPermission";

export default function MemberTasksPage() {
  const router = useRouter();
  const [openTaskId, setOpenTaskId] = useState(null);
  const { teamId, userId } = useParams();
  const [selectedTaskDesc, setSelectedTaskDesc] = useState(null);
  const {
    getMemberTasks,
    memberTasks,
    loading,
    error,
    memberInfo,
    deleteTask,
  } = useTaskStore();

  useEffect(() => {
    if (teamId && userId) {
      getMemberTasks(teamId, userId);
    }

  }, [teamId, userId]);

  const handleDeleteTask = async () => {
    await deleteTask(openTaskId);
    setOpenTaskId(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Loading Tasks...</p>
      </div>
    );
  }
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      {memberInfo && (
        <div className={styles.headings}>
          <div>
            <h2>{memberInfo.fullName}</h2>
            <p>{memberInfo.email}</p>
          </div>

          {can("task:create") && (
            <div>
              <button
                className={styles.button}
                onClick={() =>
                  router.push(
                    `/teams/myTeamsDetails/${teamId}/assignTask/${memberInfo._id}`
                  )
                }
              >
                Assign Task
              </button>
            </div>)}
        </div>
      )}

      {memberTasks.length === 0 && (
        <p className={styles.empty}>No tasks assigned</p>
      )}

      {can("task:view:all") ? (
        <div className={styles.tasksGrid}>
          {memberTasks.map((task) => (
            <div key={task._id} className={styles.taskCard}>
              <h4 className={styles.taskTitle}>{task.title}</h4>
              <p className={styles.taskDesc}> {task.description}</p>

              {task.description && task.description.length > 80 && (
                <button
                  className={styles.readMoreBtn}
                  onClick={() => setSelectedTaskDesc(task)}
                >
                  Read Description
                </button>
              )}

              <div className={styles.taskOptions}>
                <span
                  className={`${styles.status} ${task.status === "pending"
                    ? styles.pending
                    : task.status === "in-progress"
                      ? styles.inProgress
                      : styles.completed
                    }`}
                >
                  {task.status}
                </span>
                {can("task:delete") && (
                  <button
                    onClick={() => setOpenTaskId(task._id)}
                    className={styles.deleteTaskBtn}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NoPermission
          message="You don't have permission to view this team member's tasks."
        />
      )}

      {selectedTaskDesc && (
        <div
          className={styles.overlay}
          onClick={() => setSelectedTaskDesc(null)}
        >
          <div
            className={styles.descModal}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={styles.closeIcon}
              onClick={() => setSelectedTaskDesc(null)}
            >
              <RxCross2 />
            </div>
            <h3 className={styles.modalTitle}>{selectedTaskDesc.title}</h3>
            <div className={styles.modalDescContent}>
              <h4>Description</h4>
              <p>{selectedTaskDesc.description}</p>
            </div>
          </div>
        </div>
      )}

      {openTaskId && (
        <div className={styles.overlay} onClick={() => setOpenTaskId(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure to delete this Task ?</h3>
            <button
              className={`${styles.modalBtn} ${styles.delete}`}
              onClick={handleDeleteTask}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
