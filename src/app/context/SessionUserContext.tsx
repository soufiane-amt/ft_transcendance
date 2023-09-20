import { createContext, useContext, useState, ReactNode } from 'react';
//  the shape of the user data
interface UserContactDto {
  username: string;
  avatar: string;
  status?: 'ONLINE' | 'OFFLINE',

}

// Create the context
interface SessionUserContextType {
  userData: UserContactDto;
  setUser: (user: UserContactDto) => void;
}

const SessionUserContext = createContext<SessionUserContextType | undefined>(undefined);

// provider component
interface SessionUserProviderProps {
  children: ReactNode;
}

const defaultSessionUser : UserContactDto = {username:"samajat" , avatar :"/images/avatar.png"}

export function SessionUserProvider({ children }: SessionUserProviderProps) {
  const [userData, setUserData] = useState<UserContactDto>(defaultSessionUser);

  //  set user data
  const setUser = (user: UserContactDto) => {
    setUserData(user);
  };

  return (
    <SessionUserContext.Provider value={{ userData, setUser }}>
      {children}
    </SessionUserContext.Provider>
  );
}

// Custom hook to use the context
export function useSessionUser() {
  const context = useContext(SessionUserContext);
  if (!context) {
    throw new Error('useSessionUser must be used within a SessionUserProvider');
  }
  return context.userData;
}
