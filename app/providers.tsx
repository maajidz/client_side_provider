// app/providers.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../store/store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {isMounted ? (
        <PersistGate loading={null} persistor={persistor}>
          <div className="flex flex-1 h-full w-full">{children}</div>
        </PersistGate>
      ) : (
        children
      )}
    </Provider>
  );
}

