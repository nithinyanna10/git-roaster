import { create } from "zustand";
import { Mode, CursorMode } from "@/types/analysis";

interface AppState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (enabled: boolean) => void;
  liveGithub: boolean;
  setLiveGithub: (enabled: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  selectedClaimId: string | null;
  setSelectedClaimId: (id: string | null) => void;
  pinnedTiles: string[];
  setPinnedTiles: (tiles: string[]) => void;
  addPinnedTile: (tile: string) => void;
  removePinnedTile: (tile: string) => void;
  selectedMRISection: string | null;
  setSelectedMRISection: (section: string | null) => void;
  selectedKeyframeIndex: number;
  setSelectedKeyframeIndex: (index: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  mode: "roast",
  setMode: (mode) => set({ mode }),
  cursorMode: "normal",
  setCursorMode: (cursorMode) => set({ cursorMode }),
  soundEnabled: false,
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  reduceMotion: false,
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
  liveGithub: false,
  setLiveGithub: (liveGithub) => set({ liveGithub }),
  token: "",
  setToken: (token) => set({ token }),
  selectedClaimId: null,
  setSelectedClaimId: (selectedClaimId) => set({ selectedClaimId }),
  pinnedTiles: [],
  setPinnedTiles: (pinnedTiles) => set({ pinnedTiles }),
  addPinnedTile: (tile) =>
    set((state) => ({
      pinnedTiles: state.pinnedTiles.includes(tile)
        ? state.pinnedTiles
        : [...state.pinnedTiles, tile],
    })),
  removePinnedTile: (tile) =>
    set((state) => ({
      pinnedTiles: state.pinnedTiles.filter((t) => t !== tile),
    })),
  selectedMRISection: null,
  setSelectedMRISection: (selectedMRISection) => set({ selectedMRISection }),
  selectedKeyframeIndex: 0,
  setSelectedKeyframeIndex: (selectedKeyframeIndex) => set({ selectedKeyframeIndex }),
}));
