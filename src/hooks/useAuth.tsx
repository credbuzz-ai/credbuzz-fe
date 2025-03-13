
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuth: (value: boolean) => void;
  twitterConnected: boolean;
  setTwitterConnected: (value: boolean) => void;
  twitterHandle: string | null;
  setTwitterHandle: (value: string | null) => void;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated on load
    return localStorage.getItem('authenticated') === 'true';
  });
  
  const [twitterConnected, setTwitterConnected] = useState(() => {
    // Check if Twitter is already connected
    return localStorage.getItem('twitterConnected') === 'true';
  });

  const [twitterHandle, setTwitterHandleState] = useState<string | null>(() => {
    // Get stored Twitter handle
    return localStorage.getItem('twitterHandle');
  });

  const setAuth = (value: boolean) => {
    setIsAuthenticated(value);
    if (value) {
      localStorage.setItem('authenticated', 'true');
    } else {
      localStorage.removeItem('authenticated');
    }
  };
  
  const setTwitterAuth = (value: boolean) => {
    setTwitterConnected(value);
    if (value) {
      localStorage.setItem('twitterConnected', 'true');
    } else {
      localStorage.removeItem('twitterConnected');
      setTwitterHandle(null);
    }
  };

  const setTwitterHandle = (value: string | null) => {
    setTwitterHandleState(value);
    if (value) {
      localStorage.setItem('twitterHandle', value);
    } else {
      localStorage.removeItem('twitterHandle');
    }
  };

  const disconnectWallet = () => {
    setAuth(false);
    setTwitterAuth(false);
    setTwitterHandle(null);
    localStorage.removeItem('authenticated');
    localStorage.removeItem('twitterConnected');
    localStorage.removeItem('twitterHandle');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setAuth, 
      twitterConnected, 
      setTwitterConnected: setTwitterAuth,
      twitterHandle,
      setTwitterHandle,
      disconnectWallet
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
