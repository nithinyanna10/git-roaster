import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Mode, CursorMode, Analysis } from "@/types/analysis";

interface BookmarkedRepo {
  repoUrl: string;
  repoName: string;
  timestamp: number;
  analysis?: Analysis;
}

interface HistoryEntry {
  repoUrl: string;
  repoName: string;
  timestamp: number;
  mode: Mode;
}

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
  // New features
  bookmarkedRepos: BookmarkedRepo[];
  addBookmark: (repo: BookmarkedRepo) => void;
  removeBookmark: (repoUrl: string) => void;
  history: HistoryEntry[];
  addToHistory: (entry: HistoryEntry) => void;
  clearHistory: () => void;
  comparingRepos: string[];
  addComparingRepo: (repoUrl: string) => void;
  removeComparingRepo: (repoUrl: string) => void;
  clearComparing: () => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  // Custom Metrics
  customMetrics: CustomMetric[];
  addCustomMetric: (metric: CustomMetric) => void;
  removeCustomMetric: (id: string) => void;
  updateCustomMetric: (id: string, metric: Partial<CustomMetric>) => void;
  // Email Reports
  emailReports: EmailReport[];
  addEmailReport: (report: EmailReport) => void;
  removeEmailReport: (id: string) => void;
  // RSS Feeds
  rssSubscriptions: RSSSubscription[];
  addRSSSubscription: (subscription: RSSSubscription) => void;
  removeRSSSubscription: (id: string) => void;
}

export interface CustomMetric {
  id: string;
  name: string;
  formula: string;
  description: string;
  enabled: boolean;
  createdAt: number;
}

export interface EmailReport {
  id: string;
  repoUrl: string;
  repoName: string;
  email: string;
  frequency: "weekly" | "monthly";
  mode: Mode;
  enabled: boolean;
  createdAt: number;
}

export interface RSSSubscription {
  id: string;
  repoUrl: string;
  repoName: string;
  feedUrl: string;
  enabled: boolean;
  createdAt: number;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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
      // New features
      bookmarkedRepos: [],
      addBookmark: (repo) =>
        set((state) => ({
          bookmarkedRepos: state.bookmarkedRepos.some((b) => b.repoUrl === repo.repoUrl)
            ? state.bookmarkedRepos
            : [...state.bookmarkedRepos, repo],
        })),
      removeBookmark: (repoUrl) =>
        set((state) => ({
          bookmarkedRepos: state.bookmarkedRepos.filter((b) => b.repoUrl !== repoUrl),
        })),
      history: [],
      addToHistory: (entry) =>
        set((state) => {
          const filtered = state.history.filter((h) => h.repoUrl !== entry.repoUrl);
          return { history: [entry, ...filtered].slice(0, 50) }; // Keep last 50
        }),
      clearHistory: () => set({ history: [] }),
      comparingRepos: [],
      addComparingRepo: (repoUrl) =>
        set((state) => ({
          comparingRepos: state.comparingRepos.includes(repoUrl)
            ? state.comparingRepos
            : [...state.comparingRepos, repoUrl].slice(0, 4), // Max 4 repos
        })),
      removeComparingRepo: (repoUrl) =>
        set((state) => ({
          comparingRepos: state.comparingRepos.filter((r) => r !== repoUrl),
        })),
      clearComparing: () => set({ comparingRepos: [] }),
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      // Custom Metrics
      customMetrics: [],
      addCustomMetric: (metric) =>
        set((state) => ({
          customMetrics: [...state.customMetrics, metric],
        })),
      removeCustomMetric: (id) =>
        set((state) => ({
          customMetrics: state.customMetrics.filter((m) => m.id !== id),
        })),
      updateCustomMetric: (id, updates) =>
        set((state) => ({
          customMetrics: state.customMetrics.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      // Email Reports
      emailReports: [],
      addEmailReport: (report) =>
        set((state) => ({
          emailReports: [...state.emailReports, report],
        })),
      removeEmailReport: (id) =>
        set((state) => ({
          emailReports: state.emailReports.filter((r) => r.id !== id),
        })),
      // RSS Feeds
      rssSubscriptions: [],
      addRSSSubscription: (subscription) =>
        set((state) => ({
          rssSubscriptions: [...state.rssSubscriptions, subscription],
        })),
      removeRSSSubscription: (id) =>
        set((state) => ({
          rssSubscriptions: state.rssSubscriptions.filter((s) => s.id !== id),
        })),
    }),
    {
      name: "git-roaster-storage",
      partialize: (state) => ({
        bookmarkedRepos: state.bookmarkedRepos,
        history: state.history,
        comparingRepos: state.comparingRepos,
        token: state.token,
        mode: state.mode,
        theme: state.theme,
        customMetrics: state.customMetrics,
        emailReports: state.emailReports,
        rssSubscriptions: state.rssSubscriptions,
      }),
    }
  )
);
