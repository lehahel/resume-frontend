import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  checkAuthRequest,
} from "../services/AuthService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const userData = await checkAuthRequest();
      setUser(userData.user || userData);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  
  const login = async ({ login, password }) => {
    const userData = await loginRequest({ login, password });
    setUser(userData.user || userData);
    setIsAuth(true);
  };


  const register = async ({ name, email, password }) => {
    const userData = await registerRequest({ name, email, password });
    setUser(userData.user || userData);
    setIsAuth(true);
  };


  const logout = async () => {
    await logoutRequest();
    setUser(null);
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuth, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
