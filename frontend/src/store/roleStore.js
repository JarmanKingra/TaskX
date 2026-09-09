"use client";

import { create } from "zustand";
import { clientServer } from "@/lib";
import { notify } from "./notificationStore";

export const useRoleStore = create((set) => ({

    permissions: [],
    loading: false,
    error: null,
    // currTeam: null,
    // currentRole: null,
    // totalMembers: null,
    // teamMembers: null,

    // memberShip: null,


    getPermissions: async () => {
        try {
            set({ loading: true, error: null });

            const res = await clientServer.get("/api/rba/permissions");

            if (!res.data.success) {
                throw new Error("Failed to get permissions");
            }

            set({
                permissions: res.data.permissions,
                loading: false,
            });
        } catch (err) {
            const message = err.response?.data?.message || "Failed get permissions";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    },

    createNewRole: async (teamId, name, description, permissions) => {
        try {
            set({ loading: true, error: null });

            const res = await clientServer.post(`/api/rba/teams/${teamId}/roles`, {
                name,
                description,
                permissions,
            });

            if (!res.data.success) {
                throw new Error("Failed to get permissions");
            }

            set({
                loading: false,
            });

            notify("Role created successfully for this team", "success");

        } catch (err) {
            const message = err.response?.data?.message || "Failed get permissions";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    }

}))