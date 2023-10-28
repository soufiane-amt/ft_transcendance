import { Dispatch, SetStateAction, createContext, useContext } from "react";

export interface GameData {
    game_id: string;
    player1_id: string;
    player1_username: string;
    player2_id: string;
    player2_username: string;
    mapType: string;
    speed: string;
}

export interface GameDataContext {
    gamePlayData: GameData;
    setgamePlayData: Dispatch<SetStateAction<GameData>>;
}

const gameDataContext: any = createContext<GameDataContext | null>(null);

export default gameDataContext;