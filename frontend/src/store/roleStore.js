"use client";

import { create } from "zustand";
import { clientServer } from "@/lib";
import { notify } from "./notificationStore";

export const useRoleStore = create((set) => ({

    permissions: [],
    loading: false,
    error: null,
    teamRoles: [],
    currRole: null,
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
                throw new Error("Failed to create new Role");
            }

            set((state) => ({
                loading: false,
                teamRoles: res.data.role
                    ? [res.data.role, ...(state.teamRoles || []).filter((r) => r._id !== res.data.role._id)]
                    : state.teamRoles,
            }));

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
    },

    getRolesForTeam: async (teamId) => {
        try {

            set({ loading: true, error: null });
            const res = await clientServer.get(`/api/rba/teams/${teamId}/roles`);

            if (!res.data.success) {
                throw new Error("Failed to get roles");
            }

            set({
                teamRoles: res.data.roles,
                loading: false,
            });

        } catch (err) {
            const message = err.response?.data?.message || "Failed to assign role";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }

    },

    assignRole: async (teamId, memberId, roleId) => {
        try {

            set({ loading: true, error: null });
            const res = await clientServer.put(`/api/rba/teams/${teamId}/members/${memberId}/role`, {
                roleId
            });

            if (!res.data.success) {
                throw new Error("Failed to assign role");
            }

            set({
                loading: false,
            });

            notify("Role Assigned successfully for this member", "success");

        } catch (err) {
            const message = err.response?.data?.message || "Failed to assign role";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    },

    getRoleById: async (teamId, roleId) => {
        try {

            set({ loading: true, error: null });
            const res = await clientServer.get(`/api/rba/teams/${teamId}/roles/${roleId}`);

            if (!res.data.success) {
                throw new Error("Failed to get this role");
            }

            set({
                loading: false,
                currRole: res.data.role,
            });

        } catch (err) {
            const message = err.response?.data?.message || "Failed to get role";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    },

    deleteRoleById: async (teamId, roleId) => {
        try {

            set({ loading: true, error: null });
            const res = await clientServer.delete(`/api/rba/teams/${teamId}/roles/${roleId}`);

            if (!res.data.success) {
                throw new Error("Failed to delete this role");
            }

            const deletedRoleId = res.data.role._id;

            set((state) => ({
                loading: false,
                teamRoles: (state.teamRoles || []).filter((role) => role._id !== deletedRoleId),
            }));

            notify("Role Deleted successfully from this team", "success");

        } catch (err) {
            const message = err.response?.data?.message || "Failed to delete this role";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    },

    updateRoleById: async (teamId, roleId, name, description, permissions=[]) => {
        try {

            set({ loading: true, error: null });
            const res = await clientServer.put(`/api/rba/teams/${teamId}/roles/${roleId}`, {
                name,
                description,
                permissions,
            });

            if (!res.data.success) {
                throw new Error("Failed to edit this role");
            }

            set({
                loading: false,
            });

        } catch (err) {
            const message = err.response?.data?.message || "Failed to edit this role";
            set({
                error: message,
                loading: false,
            });
            notify(message, "error");

            return { success: false };
        }
    }


}))