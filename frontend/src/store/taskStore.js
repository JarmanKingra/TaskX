"use client";
import { clientServer } from "@/lib";
import { create } from "zustand";
import { notify } from "./notificationStore";

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
      notify("Task assigned successfully", "success")
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to assign task";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
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
    notify("Task deleted successfully", "success")
  } catch (err) {
    const message = err.response?.data?.message || "Failed to delete Task";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
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
    const message = error.response?.data?.message || "Failed to get member tasks";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
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
      const message = err.response?.data?.message || "Failed to fetch tasks";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
    }
  },

  fetchTaskById: async (taskId) => {
    try {
      set({ loading: true, error: null });
      const res = await clientServer.get(`api/tasks/getTask/${taskId}`);
      set({ currentTask: res.data, loading: false });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch task";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
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

      notify("Task updated successfully", "success")
      return updatedTask;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update task";

      set({
        error: message,
        loading: false,
      });

      notify(message, "error");

      return { success: false };
    }
  },

  clearCurrentTask: () => set({ currentTask: null }),
}));
