"use client";

import { useAuthStore } from "@/store/authStore";
import { usePathname, useRouter } from "next/navigation";
import styles from "./navbar.module.css";
import { cssHelper } from "@/utils/cssHelper";
import { useEffect, useState } from "react";
import ButtonSpinner from "@/components/loaders/longSpinnerLoader";

const css = cssHelper(styles);

const NAV_ITEMS = [
  { key: "home", label: "Home", loadingText: "Opening...", path: "/dashboard" },
  {
    key: "teams",
    label: "My Teams",
    loadingText: "Opening teams...",
    path: "/teams/myTeams",
  },
  {
    key: "tasks",
    label: "My Tasks",
    loadingText: "Opening tasks...",
    path: "/tasks/myTasks",
  },
];

export default function NavBarComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navigating, setNavigating] = useState(null);
  const token = useAuthStore((s) => s.token);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isBusy = Boolean(navigating);
  const authed = Boolean(isLoggedIn && token && user);

  const goTo = (key, path) => {
    if (isBusy) return;
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      setOpen(false);
      return;
    }
    setNavigating(key);
    setOpen(false);
    router.replace(path);
  };

  const handleLogout = () => {
    if (isBusy) return;
    setNavigating("logout");
    setOpen(false);
    logout();
    router.replace("/auth/login");
  };
  
  useEffect(() => {
    setNavigating(null);
  }, [pathname]);

  const isActive = (path) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className={css("header")}>
      <nav className={css("nav")}>
        <button
          type="button"
          className={css("brand")}
          disabled={isBusy}
          onClick={() => goTo("brand", authed ? "/dashboard" : "/")}
        >
          {navigating === "brand" ? (
            <span className={css("spinner")} />
          ) : (
            <svg
              className={css("brandIcon")}
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
          )}
          <span className={css("brandTitle")}>TaskX</span>
        </button>

        <button
          type="button"
          className={css("hamburger")}
          aria-label="Toggle menu"
          aria-expanded={open}
          disabled={isBusy}
          onClick={() => setOpen((p) => !p)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={css("menu", { open })}>
          {authed ? (
            <>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={css("navLink", { active: isActive(item.path) })}
                  disabled={isBusy}
                  onClick={() => goTo(item.key, item.path)}
                >
                  {navigating === item.key ? (
                    <ButtonSpinner text={item.loadingText} />
                  ) : (
                    item.label
                  )}
                </button>
              ))}
              <button
                type="button"
                className={css("logoutBtn")}
                disabled={isBusy}
                onClick={handleLogout}
              >
                {navigating === "logout" ? (
                  <ButtonSpinner text="Logging out..." />
                ) : (
                  "Logout"
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={css("loginBtn")}
              disabled={isBusy}
              onClick={() => goTo("login", "/auth/login")}
            >
              {navigating === "login" ? (
                <ButtonSpinner text="Opening..." />
              ) : (
                "Login"
              )}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
