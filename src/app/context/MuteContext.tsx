import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchDataFromApi } from '../../components/Chat/CustomFetch/fetchDataFromApi';

// Define the Mute type
interface Mute {
  room_id: string;
}


// Define the context interface
export interface IMuteContext {
  MuteRooms: Mute[];
  MuteUser: (room_id: string) => void;
  unMuteUser: (roomId: string) => void;
}



// Create the MuteContext
const MuteContext = createContext<IMuteContext | undefined>(undefined);




// Custom hook for using the MuteContext
export function useMuteContext(): IMuteContext | undefined{
  const context = useContext(MuteContext);
  // if (!context) {
  //   throw new Error('useMuteContext must be used within a MuteProvider');
  // }
  return context;
}


export function findMuteRoomContext(room_id: string) {
  const MuteRooms = useMuteContext()?.MuteRooms || []; // Provide a default empty array if MuteRooms is undefined.
  const room = MuteRooms.find((Mute) => Mute.room_id === room_id);
  return room;
}


// Provide the MuteContext at the top level of your application
interface MuteProviderProps {
  children: ReactNode;
  currentRoute: string; // Add a message prop
}

export function MuteProvider({ children,  currentRoute }: MuteProviderProps) {
  const [MuteRooms, setMuteRooms] = useState<Mute[]>([]);


  useEffect (() =>
  {
    async function fetchDataAsync() {
      const userMuteRooms: Mute[] = await fetchDataFromApi(
        `http://localhost:3001/chat/${currentRoute}/MuteRooms`
      );

      setMuteRooms(userMuteRooms)
    }
    fetchDataAsync();

  }, [])

  // Function to Mute a user
  function MuteUser(room_id: string) {
  
  const newMute: Mute = {
    room_id,
  };
  setMuteRooms((prevMuteRooms) => {
      const room =  prevMuteRooms.find((room) => room.room_id === room_id)
      if (room)
        return [...prevMuteRooms]
      return [...prevMuteRooms, newMute]
    })
  }
  
  // Function to unMute a user
  function unMuteUser(roomId: string) {
    
      setMuteRooms((prevMuteRooms) => {
        const updatedMuteRooms = prevMuteRooms.filter((item) => item.room_id !== roomId);
        return updatedMuteRooms;
      });
  }
  
  const contextValue: IMuteContext = {
    MuteRooms,
    MuteUser,
    unMuteUser,
  };



  return (
    <MuteContext.Provider value={contextValue}>
      {children}
    </MuteContext.Provider>
  ); 
}
