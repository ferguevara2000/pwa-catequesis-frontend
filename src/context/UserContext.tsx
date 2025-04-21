"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";

const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUserState(JSON.parse(storedUser));
        } catch (err) {
          console.error("Error al parsear el usuario:", err);
        }
      }
      setLoading(false);
    }
  }, []);

  const setUser = (user: User) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    setUserState(user);
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
