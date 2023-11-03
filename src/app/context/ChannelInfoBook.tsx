import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchDataFromApi } from "../components/shared/customFetch/exmple";
import { channel } from "diagnostics_channel";

/* This interface represents the minimum data needed for a user contact */
interface ChannelBookDto {
  name: string;
  avatar: string;
  type: string;
}

// The key value will represent the channel_id
const ChannelBooksContext = createContext<
  | {
      ChannelBooks: Map<string, ChannelBookDto>;
      updateChannelBook: (key: string, value: ChannelBookDto) => void;
    }
  | undefined
>(undefined);

export function ChannelBooksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ChannelBooksBook, setChannelBooksBook] = useState<
    Map<string, ChannelBookDto>
  >(new Map());

  useEffect(() => {
    async function fetchDataAsync() {
      const ChannelBooksBook_tmp = await fetchDataFromApi(
        "http://localhost:3001/chat/Channels/channelsInfoBook"
      );
      console.log ("Fetched channel Data, : ", ChannelBooksBook_tmp)
      const map = new Map();
      ChannelBooksBook_tmp.forEach((item: any) => {
        map.set(item.id, {
          name: item.name,
          avatar: item.image,
          type: item.type,
        });
      });
      console.log ("Fetched channel Data, : ", map)

      setChannelBooksBook(map);
    }
    fetchDataAsync();
  }, []);

  const updateChannelBook = (key: string, value: ChannelBookDto) => {
    setChannelBooksBook((prevState) => {
      const newState = new Map(prevState);
      newState.set(key, value);
      return newState;
    });
  };

  const contextValue = {
    ChannelBooks: ChannelBooksBook,
    updateChannelBook,
  };

  return (
    <ChannelBooksContext.Provider value={contextValue}>
      {children}
    </ChannelBooksContext.Provider>
  );
}

//A getter to ChannelBooks state

export function useChannelBooks() {
  const context = useContext(ChannelBooksContext);
  if (!context) {
    throw new Error(
      "useChannelBooks must be used within a ChannelBooksProvider"
    );
  }
  return context.ChannelBooks;
}

export function findChannelBook(channel_id: string) {
  const context = useContext(ChannelBooksContext);
  if (!context) {
    throw new Error(
      "useChannelBooks must be used within a ChannelBooksProvider"
    );
  }
  return context.ChannelBooks.get(channel_id);
}

//A getter to ChannelBooks update function

export function useUpdateChannelBook() {
  const context = useContext(ChannelBooksContext);
  if (!context) {
    throw new Error(
      "useUpdateChannelBook must be used within a ChannelBooksProvider"
    );
  }
  return context.updateChannelBook;
}

//A getter to ChannelBooks context

export function useChannelBookContext() {
  const context = useContext(ChannelBooksContext);
  if (!context) {
    throw new Error(
      "useChannelBookContext must be used within a ChannelBooksProvider"
    );
  }
  return context;
}