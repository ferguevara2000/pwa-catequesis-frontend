"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  nombre: string;
  rol: string;
} | null;

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
  const [loading, setLoading] = useState(true); // 👈 loading

  useEffect(() => {
    const nombre = localStorage.getItem("usuario");
    const rol = localStorage.getItem("rol");

    if (nombre && rol) {
      setUserState({ nombre, rol });
    }

    setLoading(false); // 👈 una vez que leí localStorage
  }, []);

  const setUser = (user: User) => {
    if (user) {
      localStorage.setItem("usuario", user.nombre);
      localStorage.setItem("rol", user.rol);
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("rol");
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
