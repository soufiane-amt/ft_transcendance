import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { fetchDataFromApi } from '../components/shared/customFetch/exmple';

// Define the Ban type
interface Ban {
  room_id: string;
  blocker_id : string;
  expirationDate: Date ;
}


// Define the context interface
export interface IBanContext {
  bannedRooms: Ban[];
  banUser: (room_id: string, blocker_id : string,expirationDate: Date) => void;
  unbanUser: (roomId: string, userId: string) => void;
}



// Create the BanContext
const BanContext = createContext<IBanContext | undefined>(undefined);




// Custom hook for using the BanContext
export function useBanContext(): IBanContext {
  const context = useContext(BanContext);
  if (!context) {
    throw new Error('useBanContext must be used within a BanProvider');
  }
  return context;
}


export function findBannedRoomContext(room_id: string) {
  const bannedRooms = useBanContext().bannedRooms || []; // Provide a default empty array if bannedRooms is undefined.
  const room = bannedRooms.find((ban) => ban.room_id === room_id);
  return room;
}


// Provide the BanContext at the top level of your application
interface BanProviderProps {
  children: ReactNode;
}

export function BanProvider({ children }: BanProviderProps) {
  const [bannedRooms, setBannedRooms] = useState<Ban[]>([]);


  useEffect (() =>
  {
    async function fetchDataAsync() {
      const userBannedRooms: Ban[] = await fetchDataFromApi(
        "http://localhost:3001/chat/direct_messaging/bannedRooms"
      );

      setBannedRooms(userBannedRooms)
    }
    fetchDataAsync();

  }, [])

  // Function to ban a user
  function banUser(room_id: string,blocker_id : string, expirationDate: Date ) {
  
  const newBan: Ban = {
    room_id,
    blocker_id,
    expirationDate,
  };
  setBannedRooms((prevBannedRooms) => {
      const room =  prevBannedRooms.find((room) => room.room_id === room_id)
      if (room)
        return [...prevBannedRooms]
      return [...prevBannedRooms, newBan]
    })
  }
  
  // Function to unban a user
  function unbanUser(roomId: string, userId: string) {
    
      setBannedRooms((prevBannedRooms) => {
        const room =  prevBannedRooms.find((room) => room.room_id === roomId)
        if (room?.blocker_id !== userId)
          return prevBannedRooms
        const updatedBannedRooms = prevBannedRooms.filter((item) => item.room_id !== roomId);
        return updatedBannedRooms;
      });
  }
  useEffect(() => {
    // This effect will run after the state has been updated
  }, [bannedRooms]); // Add bannedRooms as a dependency
  
  const contextValue: IBanContext = {
    bannedRooms,
    banUser,
    unbanUser,
  };

  return (
    <BanContext.Provider value={contextValue}>
      {children}
    </BanContext.Provider>
  ); 
}
