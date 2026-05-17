import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Storage } from 'redux-persist';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import appReducer from '@/features/app/appSlice';
import authReducer from '@/features/auth/authSlice';

// SSR-safe storage — prevents "localStorage is not defined" errors on the server
const createNoopStorage = (): Storage => ({
  getItem(_key: string): Promise<string | null> {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: string): Promise<string> {
    return Promise.resolve(value);
  },
  removeItem(_key: string): Promise<void> {
    return Promise.resolve();
  },
});

const storage: Storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootReducer = combineReducers({
  app: appReducer,
  // Auth is intentionally excluded from the persist whitelist — session is
  // managed via httpOnly cookies; user state is rehydrated on page load.
  auth: authReducer,
  // Add feature slices here
});

// Security: whitelist-only strategy — only slices explicitly listed here are
// written to localStorage. Never add slices containing auth tokens, passwords,
// session data, or payment/card information.
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: [] as string[],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches these non-serializable actions internally
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // Disable Redux DevTools in production to prevent client-side state inspection
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
