"use client"

import { useContext, useEffect, useState } from "react";
import "../../styles/TailwindRef.css";
import Game from "@/lib/Game/classes/Game";
import GameContext from "./GameContext";
import { Socket } from "socket.io-client";
import gameDataContext, { GameDataContext } from "../GlobalComponents/GameDataContext";
import MapType from "@/lib/Game/types/MapType";

function GameSceneComponent(props: any) {
    const gameContext: any = useContext<any>(GameContext);
    const gamedataContext: GameDataContext = useContext<GameDataContext>(gameDataContext);
    let gameIsStarted: boolean = true;

    useEffect(() => {
            const gameSocket: Socket = gameContext.gameSocket;
            gameSocket.on('game_paused', () => {
                gameIsStarted = false;   
            });
            gameSocket.on('game_continued', () => {
                gameIsStarted = true;
            });
            const userSide: string = gamedataContext.gamePlayData.side;
            const mapType: MapType = gamedataContext.gamePlayData.gameInfo.mapType.toLowerCase() as MapType;
            const game: Game = new Game(userSide, gameSocket, mapType);
            const FRAME_PER_SECOND: number = 60 / 1000;
            game.render();
    }, [])
    return (
        <div className="ml-auto mr-auto bg-green-900 h-3/5 w-3/5 -mt-[11%] border-[1px] border-dashed overflow-hidden rounded-[10px] border-[#E5E7FF]" id="canvas-container">
            <canvas id="canvas"></canvas>
        </div>)
}

export default GameSceneComponent;