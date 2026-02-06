import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BrewSession } from '../types';

const HISTORY_STORAGE_KEY = '@brew_bro_history';

interface BrewHistoryContextType {
  history: BrewSession[];
  isLoading: boolean;
  error: string | null;
  addSession: (session: Omit<BrewSession, 'id' | 'createdAt'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const BrewHistoryContext = createContext<BrewHistoryContextType | undefined>(undefined);

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const BrewHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<BrewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error('Failed to load history:', e);
      setError('Failed to load history');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveHistory = useCallback(async (sessions: BrewSession[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(sessions ?? []));
    } catch (e) {
      console.error('Failed to save history:', e);
      throw new Error('Failed to save history');
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addSession = useCallback(async (session: Omit<BrewSession, 'id' | 'createdAt'>) => {
    try {
      const newSession: BrewSession = {
        ...session,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const updatedHistory = [newSession, ...(history ?? [])];
      await saveHistory(updatedHistory);
      setHistory(updatedHistory);
    } catch (e) {
      console.error('Failed to add session:', e);
      throw new Error('Failed to add session');
    }
  }, [history, saveHistory]);

  const deleteSession = useCallback(async (id: string) => {
    try {
      const updatedHistory = (history ?? []).filter(session => session?.id !== id);
      await saveHistory(updatedHistory);
      setHistory(updatedHistory);
    } catch (e) {
      console.error('Failed to delete session:', e);
      throw new Error('Failed to delete session');
    }
  }, [history, saveHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
      throw new Error('Failed to clear history');
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  return (
    <BrewHistoryContext.Provider
      value={{
        history,
        isLoading,
        error,
        addSession,
        deleteSession,
        clearHistory,
        refreshHistory,
      }}
    >
      {children}
    </BrewHistoryContext.Provider>
  );
};

export const useBrewHistory = (): BrewHistoryContextType => {
  const context = useContext(BrewHistoryContext);
  if (!context) {
    throw new Error('useBrewHistory must be used within a BrewHistoryProvider');
  }
  return context;
};
