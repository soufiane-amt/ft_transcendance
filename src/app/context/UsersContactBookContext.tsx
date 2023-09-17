import React, { createContext, useContext, useState } from 'react';

/* This interface represents the minimum data needed for a user contact */
interface UserContactDto {
  username: string,
  avatar: string,
  status?: 'ONLINE' | 'OFFLINE',
}


// The key value will represent the user_id
const UserContactsContext = createContext<{
  userContacts: Map<string, UserContactDto>;
  updateUserContact: (key: string, value: UserContactDto) => void;
} | undefined>(undefined);

export function UserContactsProvider({ children }: { children: React.ReactNode }) {
  const [userContactsBook, setUserContactsBook] = useState<Map<string, UserContactDto>>(
    () => {
      const userData = [
        {
          id: '1',
          username: 'samajat',
          avatar: '/images/avatar.png',
        },
        {
          id: '2',
          username: 'Jane Smith',
          avatar: '/images/avatar2.png',
        },
        {
          id: '3',
          username: 'Alice Johnson',
          avatar: '/images/avatar3.jpeg',
        },
      ];
  
      const map = new Map();
      userData.forEach((user) => {
        map.set(user.id, {
          username: user.username,
          avatar: user.avatar,
        });
      });
      return map;
    });

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


//A getter to UserContacts state

export function useUserContacts() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error('useUserContacts must be used within a UserContactsProvider');
  }
  return context.userContacts;
}

//A getter to UserContacts update function

export function useUpdateUserContact() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error('useUpdateUserContact must be used within a UserContactsProvider');
  }
  return context.updateUserContact;
}

//A getter to UserContacts context

export function useUserContactContext() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error('useUserContactContext must be used within a UserContactsProvider');
  }
  return context;
}
