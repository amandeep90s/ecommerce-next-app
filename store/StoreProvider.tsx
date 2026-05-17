'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Loader } from '@/components/loader';
import { persistor, store } from '@/store';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {/*
       * loading={null} renders children immediately without blocking SSR/hydration.
       * Rehydration happens in the background; components read persisted state
       * once the REHYDRATE action is dispatched.
       */}
      <PersistGate loading={<Loader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
