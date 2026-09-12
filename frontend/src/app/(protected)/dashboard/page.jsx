"use client";

import styles from "./dashboard.module.css";
import { cssHelper } from "@/utils/cssHelper";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ButtonSpinner from "@/components/loaders/longSpinnerLoader";

const css = cssHelper(styles);

export default function Dashboard() {
  return <DashboardContent />;
}

function DashboardContent() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const [navigating, setNavigating] = useState(null);

  const isBusy = Boolean(navigating);

  const goTo = (key, path) => {
    if (isBusy) return;
    setNavigating(key);
    router.replace(path);
  };

  if (!user) {
    return (
      <section className={css("page")}>
        <p className={css("loading")}>Loading...</p>
      </section>
    );
  }

  const firstName = user.name?.split(" ")[0] || user.name;

  const actionCards = [
    {
      key: "teams",
      path: "/teams/myTeams",
      title: "My Teams",
      loadingText: "Opening teams...",
      description: "Open your teams, manage members, and stay aligned.",
      icon: (
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
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.747.479 5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
          />
        </svg>
      ),
    },
    {
      key: "tasks",
      path: "/tasks/myTasks",
      title: "My Tasks",
      loadingText: "Opening tasks...",
      description: "Track what is due, mark progress, and keep work moving.",
      icon: (
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
      ),
    },
    {
      key: "createTeam",
      path: "/teams/createTeam",
      title: "Create a team",
      loadingText: "Opening create team...",
      description: "Start a new workspace and invite people in minutes.",
      icon: (
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
      ),
    },
  ];

  return (
    <section className={css("page")}>
      <div className={css("bgGradientOverlay")} />
      <div className={css("bgGlowSpot")} />

      <div className={css("container")}>
        <div className={css("heroGrid")}>
          <div className={css("contentCol")}>
            <p className={css("subtitle")}>Welcome back</p>
            <h1 className={css("title")}>
              <span className={css("blockSpan")}>Hi {firstName}</span>
              <span className={css("blockSpanWithMargin")}>
                keep moving with{" "}
                <span className={css("highlightText")}>TaskX</span>
              </span>
            </h1>
            <p className={css("description")}>
              Simplify your workflow with seamless teams, intelligent task
              tracking, and a workspace built so everyone can focus on what
              truly matters.
            </p>
            <div className={css("buttonRow")}>
              <button
                type="button"
                className={css("primaryBtn")}
                disabled={isBusy}
                onClick={() => goTo("teams", "/teams/myTeams")}
              >
                {navigating === "teams" ? (
                  <ButtonSpinner text="Opening teams..." />
                ) : (
                  "My Teams"
                )}
              </button>
              <button
                type="button"
                className={css("secondaryBtn")}
                disabled={isBusy}
                onClick={() => goTo("tasks", "/tasks/myTasks")}
              >
                {navigating === "tasks" ? (
                  <ButtonSpinner text="Opening tasks..." />
                ) : (
                  "My Tasks"
                )}
              </button>
            </div>
          </div>

          <div className={css("cardCol")}>
            <div className={css("cardWrapper")}>
              <div className={css("cardGlow")} />
              <div className={css("previewCard")}>
                <div className={css("cardHeader")}>
                  <h3 className={css("cardTitle")}>Today&apos;s focus</h3>
                  <span className={css("badge")}>Workspace</span>
                </div>
                <div className={css("taskList")}>
                  <div className={css("taskItem")}>
                    <div className={css("checkboxCompleted")}>
                      <svg className={css("checkboxIcon")} viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className={css("taskTextCompleted")}>
                      Review team updates
                    </span>
                  </div>
                  <div className={css("taskItem")}>
                    <div className={css("checkboxUnchecked")} />
                    <span className={css("taskText")}>Assign next sprint</span>
                    <span className={css("priorityBadge")}>High</span>
                  </div>
                  <div className={css("taskItem")}>
                    <div className={css("checkboxUnchecked")} />
                    <span className={css("taskText")}>Sync with teammates</span>
                    <span className={css("timeBadge")}>Today</span>
                  </div>
                  <div className={css("taskItem")}>
                    <div className={css("checkboxUnchecked")} />
                    <span className={css("taskText")}>Update task board</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={css("actionsGrid")}>
          {actionCards.map((card) => (
            <button
              key={card.key}
              type="button"
              className={css("actionCard")}
              disabled={isBusy}
              onClick={() => goTo(card.key, card.path)}
            >
              <div className={css("iconBox")}>
                {navigating === card.key ? (
                  <span className={css("cardSpinner")} />
                ) : (
                  card.icon
                )}
              </div>
              {navigating === card.key ? (
                <ButtonSpinner text={card.loadingText} />
              ) : (
                <>
                  <h3 className={css("actionTitle")}>{card.title}</h3>
                  <p className={css("actionDescription")}>{card.description}</p>
                </>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
