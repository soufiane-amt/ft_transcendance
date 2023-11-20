import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchDataFromApi } from "../../components/Chat/CustomFetch/fetchDataFromApi";
//  the shape of the user data
export interface UserContactDto {
  id: string;
  username: string;
  avatar: string;
  status?: "ONLINE" | "OFFLINE";
}

// Create the context
interface SessionUserContextType {
  userData: UserContactDto;
  setUser: (user: UserContactDto) => void;
}

const SessionUserContext = createContext<SessionUserContextType | undefined>(
  undefined
);

// provider component
interface SessionUserProviderProps {
  children: ReactNode;
}

const defaultSessionUser: UserContactDto = { id: "", username: "", avatar: "" };

export function SessionUserProvider({ children }: SessionUserProviderProps) {
  const [userData, setUserData] = useState<UserContactDto>(defaultSessionUser);

  const setUser = (user: UserContactDto) => {
    setUserData(user);
  };

  useEffect(() => {
    async function fetchDataAsync() {
      const userSessiondata = await fetchDataFromApi(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/chat/userData`
      );

      setUserData(userSessiondata);
    }
    fetchDataAsync();
  }, []);

  return (
    <SessionUserContext.Provider value={{ userData, setUser }}>
      {children}
    </SessionUserContext.Provider>
  );
}

// Custom hook to use the context
export function useSessionUser(): UserContactDto {
  const context = useContext(SessionUserContext);
  if (!context) {
    throw new Error("useSessionUser must be used within a SessionUserProvider");
  }
  return context.userData;
}
