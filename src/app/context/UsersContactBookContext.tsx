import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../components/shared/customFetch/exmple";
import socket from "../socket/socket";

/* This interface represents the minimum data needed for a user contact */
interface UserContactDto {
  username: string;
  avatar: string;
  status?: "ONLINE" | "OFFLINE";
}

// The key value will represent the user_id
const UserContactsContext = createContext<
  | {
      userContacts: Map<string, UserContactDto>;
      updateUserContact: (key: string, value: UserContactDto) => void;
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
    Map<string, UserContactDto>
  >(new Map());

  useEffect(() => {
    async function fetchDataAsync() {
      const userContactsBook_tmp = await fetchDataFromApi(
        `http://localhost:3001/chat/${currentRoute}/userContactsBook`
      );
      const map = new Map();
      if (Array.isArray(userContactsBook_tmp)) {
        userContactsBook_tmp?.forEach((user: any) => {
          map.set(user.id, {
            username: user.username,
            avatar: user.avatar,
          });
        });
      }
      if (Array.isArray(userContactsBook_tmp)) {
        userContactsBook_tmp?.forEach((user: any) => {
          map.set(user.id, {
            username: user.username,
            avatar: user.avatar,
          });
        });
      }
      console.log('Initial user contacts book:', map)
      setUserContactsBook(map);
    }
    fetchDataAsync();
  }, []);

  useEffect(() => {
    const handleUpdateUserContact = (user: {id :string, username :string, avatar:string}) => {
      console.log ('user contacts book:', userContactsBook)
      const updatedUserContactsBook = new Map(userContactsBook);
      // Update the copy with the new value
      updatedUserContactsBook.set(user.id, {
        username: user.username,
        avatar: user.avatar,
      });
      // setTimeout(() => {
        setUserContactsBook(updatedUserContactsBook);
      // }, 0)
      // console.log ('Updated user contacts book:', updatedUserContactsBook)
    };
    socket.on("updateUserContact", handleUpdateUserContact);
    return () => {
      socket.off("updateUserContact", handleUpdateUserContact);
    };
  }, [userContactsBook])
  //get the user contact from the map and update it

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
    throw new Error(
      "useUserContacts must be used within a UserContactsProvider"
    );
  }
  return context.userContacts;
}

export function findUserContacts(user_id: string) {
  const context = useContext(UserContactsContext);
  console.log ('User contacts: ', context?.userContacts)
  if (!context) {
    throw new Error(
      "useUserContacts must be used within a UserContactsProvider"
    );
  }
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
