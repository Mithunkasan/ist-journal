"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

export const ReduxStoreProvider = ({ children }: Props) => {
  const storeRef = useRef<any>(null);

  if (!storeRef.current) {
    storeRef.current = store;
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};
