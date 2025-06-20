"use client";

import { create } from 'zustand';
import { generateData } from '@/lib/actions/GenerateDataAction';

interface PreloadState {
    isLoading: boolean;
    isCompleted: boolean;
    startPreload: () => Promise<void>;
    setIsLoading: (isLoading: boolean) => void;
    setIsCompleted: (isCompleted: boolean) => void;
}

export const usePreloadStore = create<PreloadState>((set) => ({
    isLoading: false,
    isCompleted: false,
    startPreload: async () => {
        await generateData();
    },
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    setIsCompleted: (isCompleted: boolean) => set({ isCompleted }),
}));

interface ExamState {
    queries: Record<string, string>;
    setQuery: (query: string, questionId: string) => void;
}

export const useExamStore = create<ExamState>((set) => ({
    queries: {},
    setQuery: (query: string, questionId: string) => set((state) => ({ 
        queries: { ...state.queries, [questionId]: query } 
    })),
}));
