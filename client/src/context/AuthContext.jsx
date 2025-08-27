import { createContext, useMemo, useState } from 'react';

// Create a context for authentication state
export const AuthCtx = createContext(null);

// Provider component to wrap the app and provide auth state
export default function AuthProvider({ children }) {
  // Store token in state, initialized from localStorage
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    token,
    // Save token to state and localStorage on login
    login: (t) => { setToken(t); localStorage.setItem('token', t); },
    // Clear token from state and localStorage on logout
    logout: () => { setToken(null); localStorage.removeItem('token'); }
  }), [token]);

  // Provide the auth context to child components
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
