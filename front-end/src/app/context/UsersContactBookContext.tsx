import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../../components/Chat/CustomFetch/fetchDataFromApi";
import socket from "../socket/socket";
import { useSessionUser } from "./SessionUserContext";

/* This interface represents the minimum data needed for a user contact */
export interface UserContactDataDto {
  username: string;
  avatar: string;
  status?: "ONLINE" | "OFFLINE";
}

// The key value will represent the user_id
const UserContactsContext = createContext<
  | {
      userContacts: Map<string, UserContactDataDto>;
      updateUserContact: (key: string, value: UserContactDataDto) => void;
    }
  | undefined
>(undefined);

export function UserContactsProvider({
  currentRoute, 
  children,
}:
  {currentRoute: string , children: React.ReactNode}
) {
  const [userContactsBook, setUserContactsBook] = useState<
    Map<string, UserContactDataDto>
  >(new Map());
  const currentUserId = useSessionUser().id

  useEffect(() => {
    async function fetchDataAsync() {
      const userContactsBook_tmp = await fetchDataFromApi(
        `http://localhost:3001/chat/${currentRoute}/userContactsBook`
      );
      const map = new Map();
      if (Array.isArray(userContactsBook_tmp)) {
        userContactsBook_tmp?.forEach((user: any) => {
          if (user.id !== currentUserId)
          map.set(user.id, {
            username: user.username,
            avatar: user.avatar,
          });
        });
      }
      setUserContactsBook(map);
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const handleUpdateUserContact = (user: {id :string, username :string, avatar:string}) => {
      console.log('updateUserContact', user)
      const updatedUserContactsBook = new Map(userContactsBook);
      // Update the copy with the new value
      updatedUserContactsBook.set(user.id, {
        username: user.username,
        avatar: user.avatar,
      });
      // setTimeout(() => {
        setUserContactsBook(updatedUserContactsBook);
      // }, 0)
    };
    const handleUpdateContactsChannelCreate = (users:any) => {
      
      console.log('updateUserContactChannelCreate', users)
      const map = new Map(userContactsBook);
      if (Array.isArray(users)) {
        users?.forEach((user: any) => {
          if (user.id !== currentUserId)
          map.set(user.id, {
            username: user.username,
            avatar: user.avatar,
          });
        });
      }
      setUserContactsBook(map);
    }

    socket.on("updateUserContact", handleUpdateUserContact);
    socket.on("updateUserContactChannelCreate", handleUpdateContactsChannelCreate);
    return () => {
      socket.off("updateUserContact", handleUpdateUserContact);
      socket.off("updateUserContactChannelCreate", handleUpdateContactsChannelCreate);
    };
  }, [userContactsBook])
  //get the user contact from the map and update it

  const updateUserContact = (key: string, value: UserContactDataDto) => {
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
    throw new Error(
      "useUserContacts must be used within a UserContactsProvider"
    );
  }
  return context.userContacts;
}

export function useFindUserContacts(user_id: string | undefined){
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error(
      "useUserContacts must be used within a UserContactsProvider"
      );
    }
    if (!user_id) 
      return undefined
  return context.userContacts.get(user_id);
}

//A getter to UserContacts update function

export function useUpdateUserContact() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error(
      "useUpdateUserContact must be used within a UserContactsProvider"
    );
  }
  return context.updateUserContact;
}

//A getter to UserContacts context

export function useUserContactContext() {
  const context = useContext(UserContactsContext);
  if (!context) {
    throw new Error(
      "useUserContactContext must be used within a UserContactsProvider"
    );
  }
  return context;
}
