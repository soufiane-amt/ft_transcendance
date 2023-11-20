"use client";

import { useContext, useEffect, useState } from "react";
import "../../styles/TailwindRef.css";
import Game from "@/lib/Game/classes/OnlineGame/Game";
import GameContext from "./GameContext";
import { Socket } from "socket.io-client";
import newSocket from "../GlobalComponents/Socket/socket";
import Cookies from "js-cookie";
import MapType from "@/lib/Game/types/MapType";
import PracticeGame from "@/lib/Game/classes/PracticeGame/Game";
import Speed from "@/lib/Game/types/Speed";

const cleanUp = (handleClick: any, handleResize: any, animationId: number) => {
  cancelAnimationFrame(animationId);
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keypress", handleClick);
};

function GameSceneComponent(props: any) {
  const gameContext: any = useContext<any>(GameContext);
  let gameIsStarted: boolean = true;

  useEffect(() => {
    if (props.gameData !== null) {
      const gameSocket: Socket = gameContext.gameSocket;
      gameSocket.on("game_paused", () => {
        gameIsStarted = false;
      });
      gameSocket.on("game_continued", () => {
        gameIsStarted = true;
      });
      const userSide: string = props.gameData.side;
      const mapType: MapType = props.gameData.mapType.toLowerCase() as MapType;
      var game: Game | null = new Game(userSide, gameSocket, mapType);
      userSide === "left"
        ? game.User.upadatepos(props.gameData.leftplayerPos)
        : game.User.upadatepos(props.gameData.rightplayerPos);
      userSide === "left"
        ? game.Opponent.upadatepos(props.gameData.rightplayerPos)
        : game.Opponent.upadatepos(props.gameData.leftplayerPos);
      var handleResize: EventListener = (e: Event) => game?.resize();
      var handleClick: (event: KeyboardEvent) => void = (e: KeyboardEvent) => {
        if (e.key === " ") {
          const payload: any = {
            side: game?.User.side,
          };
          game?.socket.emit("stop_game", payload);
        }
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("keypress", handleClick);
      const FRAME_PER_SECOND: number = 60 / 1000;
      let startTime: DOMHighResTimeStamp | undefined = undefined;
      var animationId: number;
      const frameRequestCall = (timestamp: DOMHighResTimeStamp) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }
        if (
          gameIsStarted === true &&
          timestamp - startTime >= FRAME_PER_SECOND
        ) {
          game?.render();
        }
        animationId = requestAnimationFrame(frameRequestCall);
      };
      requestAnimationFrame(frameRequestCall);
    }
    return () => {
      if (props.gameData !== null) {
        cleanUp(handleClick, handleResize, animationId);
        game = null;
      }
    };
  }, [props.gameData]);

  useEffect(() => {
    if (gameContext.GameSettings.GameMode === "Practice") {
      const mapType: MapType = gameContext.GameSettings.GameTheme.toLowerCase();
      const speed: Speed = gameContext.GameSettings.GameSpeed.toLowerCase();
      var game: PracticeGame | null = new PracticeGame(
        mapType,
        speed,
        props.setUserScore,
        props.setComputerScore,
        props.setRound
      );
      var handleResize: EventListener = (e: Event) => game?.resize();
      var handleClick: (event: KeyboardEvent) => void = (e: KeyboardEvent) => {
        if (e.key === " ") {
          gameIsStarted = !gameIsStarted;
        }
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("keypress", handleClick);
      const FRAME_PER_SECOND: number = 60 / 1000;
      let startTime: DOMHighResTimeStamp | undefined = undefined;
      var animationId: number;
      const frameRequestCall = (timestamp: DOMHighResTimeStamp) => {
        if (game !== null && game.status === "finished") {
          const result: string =
            game?.User.winningRounds > game?.Computer.winningRounds
              ? "win"
              : "lose";
          props.setresult(result);
          props.setIsGameFinished(true);
          props.setIsGameStarted(false);
        }
        if (startTime === undefined) {
          startTime = timestamp;
        }
        if (
          gameIsStarted === true &&
          timestamp - startTime >= FRAME_PER_SECOND
        ) {
          game?.play();
        }
        animationId = requestAnimationFrame(frameRequestCall);
      };
      requestAnimationFrame(frameRequestCall);
    }
    return () => {
      if (gameContext.GameSettings.GameMode === "Practice") {
        const JwtToken: string | undefined = Cookies.get("access_token");
        const payload: any = {
          status: "",
          token: `bearer ${JwtToken}`,
        };
        newSocket.emit("status", payload);
        cleanUp(handleClick, handleResize, animationId);
        game = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gameContext.gameDataInfo !== null) {
      const gameSocket: Socket = gameContext.gameSocket;
      gameSocket.on("game_paused", () => {
        gameIsStarted = false;
      });
      gameSocket.on("game_continued", () => {
        gameIsStarted = true;
      });
      const userSide: string = gameContext.gameDataInfo.side;
      const mapType: MapType =
        gameContext.gameDataInfo.gameInfo.mapType.toLowerCase() as MapType;
      var game: Game | null = new Game(userSide, gameSocket, mapType);
      var handleResize: EventListener = (e: Event) => game?.resize();
      var handleClick: (event: KeyboardEvent) => void = (e: KeyboardEvent) => {
        if (e.key === " ") {
          const payload: any = {
            side: game?.User.side,
          };
          game?.socket.emit("stop_game", payload);
        }
      };
      window.addEventListener("resize", handleResize);
      window.addEventListener("keypress", handleClick);
      const FRAME_PER_SECOND: number = 60 / 1000;
      let startTime: DOMHighResTimeStamp | undefined = undefined;
      var animationId: number;
      const frameRequestCall = (timestamp: DOMHighResTimeStamp) => {
        if (startTime === undefined) {
          startTime = timestamp;
        }
        if (
          gameIsStarted === true &&
          timestamp - startTime >= FRAME_PER_SECOND
        ) {
          game?.render();
        }
        animationId = requestAnimationFrame(frameRequestCall);
      };
      requestAnimationFrame(frameRequestCall);
    }
    return () => {
      if (gameContext.gameDataInfo !== null)
        cleanUp(handleClick, handleResize, animationId);
      game = null;
    };
  }, []);
  return (
    <div
      className="ml-auto mr-auto bg-green-900 h-3/5 w-3/5 -mt-[11%] border-[1px] border-dashed overflow-hidden rounded-[10px] border-[#E5E7FF]"
      id="canvas-container"
    >
      <canvas id="canvas"></canvas>
    </div>
  );
}

export default GameSceneComponent;
