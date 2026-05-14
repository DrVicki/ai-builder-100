import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { MODULES } from '@/lib/data';

const STORAGE_KEY = 'ai-builder-100-progress';

interface ProgressState {
  completedTopics: Record<string, boolean>; // key: "moduleSlug-topicId"
}

interface ProgressContextValue {
  completedTopics: Record<string, boolean>;
  isTopicComplete: (moduleSlug: string, topicId: number) => boolean;
  toggleTopic: (moduleSlug: string, topicId: number) => void;
  getModuleProgress: (moduleSlug: string) => { completed: number; total: number; percent: number };
  getOverallProgress: () => { completedTopics: number; totalTopics: number; completedModules: number; totalModules: number; percent: number };
  resetAll: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return { completedTopics: {} };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isTopicComplete = useCallback(
    (moduleSlug: string, topicId: number) => !!state.completedTopics[`${moduleSlug}-${topicId}`],
    [state.completedTopics]
  );

  const toggleTopic = useCallback((moduleSlug: string, topicId: number) => {
    const key = `${moduleSlug}-${topicId}`;
    setState((prev) => ({
      completedTopics: {
        ...prev.completedTopics,
        [key]: !prev.completedTopics[key],
      },
    }));
  }, []);

  const getModuleProgress = useCallback(
    (moduleSlug: string) => {
      const mod = MODULES.find((m) => m.slug === moduleSlug);
      if (!mod) return { completed: 0, total: 0, percent: 0 };
      const total = mod.topics.length;
      const completed = mod.topics.filter((t) => state.completedTopics[`${moduleSlug}-${t.id}`]).length;
      return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    },
    [state.completedTopics]
  );

  const getOverallProgress = useCallback(() => {
    const totalTopics = MODULES.reduce((sum, m) => sum + m.topics.length, 0);
    const completedTopics = Object.values(state.completedTopics).filter(Boolean).length;
    const completedModules = MODULES.filter((m) => {
      const { completed, total } = getModuleProgress(m.slug);
      return total > 0 && completed === total;
    }).length;
    return {
      completedTopics,
      totalTopics,
      completedModules,
      totalModules: MODULES.length,
      percent: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    };
  }, [state.completedTopics, getModuleProgress]);

  const resetAll = useCallback(() => {
    setState({ completedTopics: {} });
  }, []);

  return (
    <ProgressContext.Provider value={{ completedTopics: state.completedTopics, isTopicComplete, toggleTopic, getModuleProgress, getOverallProgress, resetAll }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
