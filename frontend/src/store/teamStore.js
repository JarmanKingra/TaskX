"use client";
import { create } from "zustand";
import { clientServer } from "@/lib";

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
      console.error("GET TEAMS ERROR:", error);
      set({
        error: error.response?.data?.message || "Failed to fetch team",
        loading: false,
      });
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
    } catch (error) {
      console.error("CREATE TEAM ERROR:", error);
      set({
        error: error.response?.data?.message || "Failed to create team",
        loading: false,
      });
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
      set({
        error: err.response?.data?.message || "Failed to fetch team",
        loading: false,
      });
    }
  },

  removeMember: async(teamId, memberId) => {
    try {

      set({ loading: true, error: null });
      const res = await clientServer.delete(`/api/teams/${teamId}/members/${memberId}`);

      set((state) => ({
      currTeam: {
        ...state.currTeam,
        members: state.currTeam.members.filter(
          (member) => member._id !== memberId
        ),
      },
      loading: false,
    }));
      
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to Remove member",
        loading: false,
      });
    }
  },

  addMember: async (teamId, email) => {
  try {
    set({ loading: true, error: null });

    const res = await clientServer.post(
      `/api/teams/${teamId}/members`,
      { email }
    );

    set((state) => ({
      currTeam: {
        ...state.currTeam,
        members: [...state.currTeam.members, res.data.member],
      },
      loading: false,
    }));

    return { success: true };

  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to add member",
      loading: false,
    });

    return { success: false };
  }
},


}));
