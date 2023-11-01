"use client"

import { useContext, useEffect, useState } from "react";
import "../../styles/TailwindRef.css";
import Game from "@/lib/Game/classes/Game";
import GameContext from "./GameContext";
import { Socket } from "socket.io-client";
import gameDataContext, { GameDataContext } from "../GlobalComponents/GameDataContext";
import MapType from "@/lib/Game/types/MapType";

const cleanUp = (handleClick: any, handleResize: any, animationId: number) => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keypress', handleClick);
    }

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
            let game: Game | null = new Game(userSide, gameSocket, mapType);
            const handleResize: EventListener = (e: Event) => game?.resize();
            const handleClick: (event: KeyboardEvent) => void = (e: KeyboardEvent) => {
                if (e.key === ' ') {
                    const payload: any = {
                        side: game?.User.side
                    }
                    game?.socket.emit('stop_game', payload);
                }
            }
            window.addEventListener('resize', handleResize);
            window.addEventListener('keypress', handleClick);
            const FRAME_PER_SECOND: number = 60 / 1000;
            let startTime: DOMHighResTimeStamp | undefined = undefined;
            let animationId: number;
            const frameRequestCall = (timestamp: DOMHighResTimeStamp) => {
                if (startTime === undefined) {
                    startTime = timestamp;
                }
                if (gameIsStarted === true && (timestamp - startTime) >= FRAME_PER_SECOND) {
                    game?.render();
                }
                animationId = requestAnimationFrame(frameRequestCall);
            }
            requestAnimationFrame(frameRequestCall);
            return () => { cleanUp(handleClick, handleResize, animationId); game = null}
    }, [])
    return (
        <div className="ml-auto mr-auto bg-green-900 h-3/5 w-3/5 -mt-[11%] border-[1px] border-dashed overflow-hidden rounded-[10px] border-[#E5E7FF]" id="canvas-container">
            <canvas id="canvas"></canvas>
        </div>)
}

export default GameSceneComponent;