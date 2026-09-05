import { useTeamStore } from "@/store/teamStore";

export function can(name) {
  return useTeamStore.getState().can(name);
}
