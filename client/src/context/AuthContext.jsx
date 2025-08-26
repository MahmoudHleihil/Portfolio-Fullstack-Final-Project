import { createContext, useMemo, useState } from 'react';
export const AuthCtx = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const value = useMemo(() => ({
    token,
    login: (t) => { setToken(t); localStorage.setItem('token', t); },
    logout: () => { setToken(null); localStorage.removeItem('token'); }
  }), [token]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
