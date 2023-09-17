import React, { createContext, useContext, useState } from 'react';

/* This interface represents the minimum data needed for a user contact */
interface UserContactDto {
  username: string;
  avatar: string;
  status: 'ONLINE' | 'OFFLINE';
}

// The key value will represent the user_id
const UserContactsContext = createContext<{
  userContacts: Map<string, UserContactDto>;
  updateUserContact: (key: string, value: UserContactDto) => void;
} | undefined>(undefined);

export function UserContactsProvider({ children }: { children: React.ReactNode }) {
  const [userContactsBook, setUserContactsBook] = useState<Map<string, UserContactDto>>(
    new Map()
  );

  const updateUserContact = (key: string, value: UserContactDto) => {
    setUserContactsBook((prevState) => {
      const newState = new Map(prevState);
      newState.set(key, value);
      return newState;
    });
  };

  const contextValue = {
    userContacts: userContactsBook,
    updateUserContact,
  };

  return (
    <UserContactsContext.Provider value={contextValue}>
      {children}
    </UserContactsContext.Provider>
  );
}

export function useUserContactContext() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error('useUserContactContext must be used within a UserContactsProvider');
  }
  return context;
}
