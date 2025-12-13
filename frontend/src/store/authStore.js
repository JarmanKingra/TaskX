"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      user: null,
      isLoggedIn: false,

      login: (data) =>
        set({
          token: data.token,
          user: data.user,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          token: "",
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
