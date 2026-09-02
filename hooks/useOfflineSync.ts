'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PendingSyncItem {
  id: string;
  type: 'COMPLETE_WO' | 'CREATE_WO' | 'CREATE_OS' | 'UPDATE_OS_STATUS' | 'UPDATE_CHECKLIST' | 'ATTACH_PHOTO' | 'GPS_CHECKIN' | string;
  payload: any;
  timestamp: string;
}

const STORAGE_KEY_OFFLINE_QUEUE = 'zx360_v2_offline_queue';

export function useOfflineSync(
  onSyncCompleted?: (syncedCount: number) => void
) {
  // Initialize state with default safe values
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [queue, setQueue] = useState<PendingSyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [serverConnectionOk, setServerConnectionOk] = useState<boolean>(true);

  // Load saved offline queue and initial timestamp on client mount asynchronously
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedQueue = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
        if (savedQueue) {
          setQueue(JSON.parse(savedQueue));
        }
      } catch (e) {
        console.error('Falha ao recuperar fila offline:', e);
      }
      setLastSyncTime(new Date().toLocaleTimeString('pt-BR'));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Monitor real network online/offline events via listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setServerConnectionOk(true);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setServerConnectionOk(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check deferred
    const checkTimer = setTimeout(() => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOnline(false);
        setServerConnectionOk(false);
      }
    }, 0);

    return () => {
      clearTimeout(checkTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save queue whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(queue));
    } catch (e) {
      console.error('Falha ao persistir fila offline localmente:', e);
    }
  }, [queue]);

  // Transmit sync queue to server over the internet
  const processSyncQueue = useCallback(async () => {
    if (queue.length === 0 || isSyncing) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: queue }),
      });

      if (response.ok) {
        const count = queue.length;
        setQueue([]);
        const nowStr = new Date().toLocaleTimeString('pt-BR');
        setLastSyncTime(nowStr);
        setIsOnline(true);
        setServerConnectionOk(true);
        if (onSyncCompleted) {
          onSyncCompleted(count);
        }
      } else {
        console.warn('Servidor retornou erro na sincronização.');
      }
    } catch (error) {
      console.warn('Sem conexão no momento. Os dados permanecem salvos localmente e serão reenviados assim que a internet voltar.', error);
      setIsOnline(false);
    } finally {
      setIsSyncing(false);
    }
  }, [queue, isSyncing, onSyncCompleted]);

  // Push new action to queue and try sending to server if online
  const queueAction = useCallback(
    async (actionOrType: PendingSyncItem['type'] | { type: string; payload: any }, maybePayload?: any) => {
      let type: string;
      let payload: any;

      if (typeof actionOrType === 'object' && actionOrType !== null) {
        type = actionOrType.type;
        payload = actionOrType.payload;
      } else {
        type = actionOrType;
        payload = maybePayload;
      }

      const newItem: PendingSyncItem = {
        id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        type,
        payload,
        timestamp: new Date().toLocaleTimeString('pt-BR'),
      };

      // If device is online, attempt direct transmission
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          const res = await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ singleItem: newItem }),
          });
          if (res.ok) {
            setLastSyncTime(new Date().toLocaleTimeString('pt-BR'));
            setIsOnline(true);
            return;
          }
        } catch {
          setIsOnline(false);
        }
      }

      // If offline or fetch failed, save to local queue
      setQueue((prev) => [newItem, ...prev]);
    },
    []
  );

  // Auto-sync as soon as the internet connection is restored
  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      const timer = setTimeout(() => {
        processSyncQueue();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, queue.length, isSyncing, processSyncQueue]);

  return {
    isOnline,
    queue,
    pendingCount: queue.length,
    isSyncing,
    lastSyncTime,
    serverConnectionOk,
    queueAction,
    triggerManualSync: processSyncQueue,
    syncNow: processSyncQueue,
    clearQueue: () => setQueue([]),
  };
}
