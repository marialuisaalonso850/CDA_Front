import React, { useContext, createContext, useState } from "react";
import type { User } from "../types/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface ExtendedAuthContext {
  esAutentico: boolean;
  getUser: () => User | undefined;
  signOut: () => void;
  signIn: (userData: User) => void;
}

const AuthContext = createContext<ExtendedAuthContext>({
  esAutentico: false,
  signIn: () => {},
  getUser: () => undefined,
  signOut: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [esAutentico, setEsAutentico] = useState(false);
  const [user, setUser] = useState<User>();

  const signIn = async (userData: User) => {
    setUser(userData);
    setEsAutentico(true);
  };

  function signOut() {
    setEsAutentico(false);
    setUser(undefined);
  }

  function getUser() {
    return user;
  }

  return (
    <AuthContext.Provider value={{ esAutentico, getUser, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);