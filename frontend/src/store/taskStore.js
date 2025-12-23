"use client";
import { clientServer } from "@/lib";
import { create } from "zustand";

export const useTaskStore = create((set) => ({
  tasks: [],
  currentTask: null,
  memberTasks: [],
  memberInfo: null,
  loading: false,
  error: null,

  assignTask: async (title, description, deadline, assignedTo, team) => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.post("/api/tasks", {
        title,
        description,
        deadline,
        assignedTo,
        team,
      });

      set((state) => ({
        tasks: [res.data, ...state.tasks],
        loading: false,
      }));
    } catch (error) {
      console.error("ASSIGN TASK ERROR:", error);
      set({
        error: error.response?.data?.message || "Failed to assign task",
        loading: false,
      });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
  try {
    set({ loading: true, error: null });

    await clientServer.delete(`/api/tasks/${taskId}`);

    set((state) => ({
      memberTasks: state.memberTasks.filter(
        (task) => task._id !== taskId
      ),
      tasks: state.tasks.filter(
        (task) => task._id !== taskId
      ),
      loading: false,
    }));
  } catch (err) {
    set({
      error: err.response?.data?.message || "Failed to delete task",
      loading: false,
    });
    throw err;
  }
},

  getMemberTasks: async (teamId, userId) => {
  try {
    set({ loading: true, error: null });

    const res = await clientServer.get(
      `/api/tasks/team/${teamId}/user/${userId}/tasks`
    );

    set({
      memberTasks: res.data.tasks,
      memberInfo: res.data.user,
      loading: false,
    });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Failed to fetch member tasks",
      loading: false,
    });
  }
},


  fetchMyTasks: async () => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.get("api/tasks/my/tasks");

      set({
        tasks: res.data,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch My tasks",
        loading: false,
      });
    }
  },

  fetchTaskById: async (taskId) => {
    try {
      set({ loading: true, error: null });
      const res = await clientServer.get(`api/tasks/getTask/${taskId}`);
      set({ currentTask: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch task",
        loading: false,
      });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    try {
      set({ loading: true, error: null });

      const res = await clientServer.patch(`api/tasks/${taskId}/status`, {
        status,
      });

      const updatedTask = res.data.updatedTask;

      set((state) => ({
        tasks: state.tasks.map((task) =>
          task._id === taskId ? updatedTask : task
        ),
        currentTask:
          state.currentTask?._id === taskId ? updatedTask : state.currentTask,
        loading: false,
      }));

      return updatedTask;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update task status",
        loading: false,
      });
      throw err;
    }
  },

  clearCurrentTask: () => set({ currentTask: null }),
}));
