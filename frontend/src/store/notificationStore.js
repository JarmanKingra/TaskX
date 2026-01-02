import { create } from "zustand";

export const useNotificationStore = create((set) => ({
  message: "",
  type: "info",
  visible: false,

  show: (message, type = "info") =>
    set({ message, type, visible: true }),

  clear: () =>
    set({ message: "", type: "info", visible: false }),
}));

export const notify = (message, type = "info") => {
  useNotificationStore.getState().show(message, type);
};
