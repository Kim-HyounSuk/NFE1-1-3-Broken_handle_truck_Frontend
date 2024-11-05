import { create } from "zustand";
import { IUser } from "../types/auth";

interface UserState {
  user: IUser | null;
  setUser: (newUser: IUser | null) => void;
  setNickname: (nickname: string) => void;
  setRole: (role: "owner" | "user") => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
  setNickname: (nickname) =>
    set((state) => ({ user: state.user ? { ...state.user, nickname } : null })), //get().setUser({ ...get().user, nickname }),
  setRole: (role) =>
    set((state) => ({ user: state.user ? { ...state.user, role } : null })), //get().setUser({ ...get().user, role }),
}));

export default useUserStore;
