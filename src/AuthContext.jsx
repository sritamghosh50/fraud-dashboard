import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    () =>
      localStorage.getItem(
        'fraudguard_token'
      )
  );

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem(
        'fraudguard_user'
      );

    try {

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch {

      return null;
    }
  });

  // =========================================================
  // SAVE TOKEN
  // =========================================================

  useEffect(() => {

    if (token) {

      localStorage.setItem(
        'fraudguard_token',
        token
      );

    } else {

      localStorage.removeItem(
        'fraudguard_token'
      );
    }

  }, [token]);

  // =========================================================
  // SAVE USER
  // =========================================================

  useEffect(() => {

    if (user) {

      localStorage.setItem(
        'fraudguard_user',
        JSON.stringify(user)
      );

    } else {

      localStorage.removeItem(
        'fraudguard_user'
      );
    }

  }, [user]);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = useCallback(
    (
      newToken,
      email,
      fullName
    ) => {

      if (!newToken) {
        return;
      }

      setToken(newToken);

      setUser({
        email: email,

        fullName:
          fullName ||
          email?.split('@')[0] ||
          'User',
      });
    },
    []
  );

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = useCallback(() => {

    setToken(null);

    setUser(null);

    localStorage.removeItem(
      'fraudguard_token'
    );

    localStorage.removeItem(
      'fraudguard_user'
    );

    localStorage.removeItem(
      'fraudguard_history_filter'
    );

    /*
     * Remove temporary browser OAuth data.
     */
    sessionStorage.clear();

  }, []);

  const isLoggedIn =
    Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}