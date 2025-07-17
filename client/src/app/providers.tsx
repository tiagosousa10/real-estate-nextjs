"use client";

import StoreProvider from "@/state/redux";
import { ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {
  return <StoreProvider>{children}</StoreProvider>;
};

export default Providers;
