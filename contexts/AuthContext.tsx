"use client";

import { ReactNode, createContext, useState } from "react";

type TAuthContext = {
  email: string;
  id: string;
} | null;

const AuthContext = createContext<any>(undefined);

const AuthContextWrapper = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TAuthContext>(null);
  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextWrapper;
