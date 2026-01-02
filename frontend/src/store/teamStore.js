"use client";
import { create } from "zustand";
import { clientServer } from "@/lib";
import { notify } from "./notificationStore";

export const useTeamStore = create((set) => ({
  teams: [],
  currTeam: null,
  totalMembers: null,
  teamMembers: null,
  loading: false,
  error: null,

  getMyTeams: async () => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.get("/api/teams");

      set({
        teams: res.data,
        loading: false,
      });
    } catch (error) {
      const message = err.response?.data?.message || "Failed get your teams";
      set({
        error: message,
        loading: false,
      });
      notify(message, "error");

      return { success: false };
    }
  },

  createTeam: async (name) => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.post("/api/teams", {
        name,
      });

      set((state) => ({
        teams: [res.data.team, ...state.teams],
        loading: false,
      }));
      notify("Team created successfully", "success")
    } catch (error) {
      const message = err.response?.data?.message || "Failed to create team";
      set({
        error: message,
        loading: false,
      });
      notify(message, "error");

      return { success: false };
    }
  },

  fetchTeamById: async (teamId) => {
    try {
      set({ loading: true, error: null });
      const res = await clientServer.get(`/api/teams/${teamId}`);
      set({
        currTeam: res.data,
        teamMembers: res.data.members.length,
        loading: false,
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load team";
      set({
        error: message,
        loading: false,
      });
      notify(message, "error");

      return { success: false };
    }
  },

  removeMember: async (teamId, memberId) => {
    try {
      set({ loading: true, error: null });
      const res = await clientServer.delete(
        `/api/teams/${teamId}/members/${memberId}`
      );

      set((state) => ({
        currTeam: {
          ...state.currTeam,
          members: state.currTeam.members.filter(
            (member) => member._id !== memberId
          ),
        },
        loading: false,
      }));

      notify("Member removed successfully", "success")
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove member";
      set({
        error: message,
        loading: false,
      });
      notify(message, "error");

      return { success: false };
    }
  },

  addMember: async (teamId, email) => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.post(`/api/teams/${teamId}/members`, {
        email,
      });

      set((state) => ({
        currTeam: {
          ...state.currTeam,
          members: [...state.currTeam.members, res.data.member],
        },
        loading: false,
      }));

      notify("Member added successfully", "success")

      
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add member";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
    }
  },
}));
