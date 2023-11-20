"use client";

import React, { useContext, useEffect, useState } from "react";
import ScoreBoardComponent from "./ScoreBoardComponent";
import GameSceneComponent from "./GameSceneComponent";
import GameContext from "./GameContext";
import { Socket } from "socket.io-client";
import newSocket from "../GlobalComponents/Socket/socket";
import Cookies from "js-cookie";
import GameWaiting from "./GameWaiting";
import GameResult from "./GameResult";
import GameState from "./interfaces/GameState";
import LeavingGameData from "./interfaces/LeavingGameData";

function GameDashboard() {
  const gameContext: any = useContext<any>(GameContext);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [UserScore, setUserScore] = useState<number>(0);
  const [ComputerScore, setComputerScore] = useState<number>(0);
  const [Round, setRound] = useState<number>(1);
  const [result, setresult] = useState("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameData, setgameData] = useState<LeavingGameData | null>(null);

  useEffect(() => {
    gameContext.gameSocket.on("leaving_game_data", (payload: any) => {
      const gameState: GameState = {
        player1_avatar: payload.player1_avatar,
        player2_avatar: payload.player2_avatar,
        player1_username: payload.player1_username,
        player2_username: payload.player2_username,
        player1_score: payload.player1_score,
        player2_score: payload.player2_score,
        round: payload.round,
      };
      setGameState(gameState);
      const gameData: LeavingGameData = {
        mapType: payload.mapType,
        side: payload.side,
        leftplayerPos: payload.leftplayerPos,
        rightplayerPos: payload.rightplayerPos,
      };
      setgameData(gameData);
      setIsGameStarted(true);
    });
  }, []);

  useEffect(() => {
    if (gameContext.GameSettings.GameMode === "Practice") {
      setTimeout(() => {
        setIsGameStarted(true);
      }, 2500);
    }
  }, []);

  useEffect(() => {
    const JwtToken: string | undefined = Cookies.get("access_token");
    if (isGameStarted === true) {
      const payload: any = {
        status: "INGAME",
        token: `bearer ${JwtToken}`,
      };
      newSocket.emit("status", payload);
    } else if (isGameFinished === true) {
      const payload: any = {
        status: "",
        token: `bearer ${JwtToken}`,
      };
      newSocket.emit("status", payload);
      if (gameContext.GameSettings.GameMode === "Practice") {
        gameContext.setGameSettings({
          GameMode: "",
          GameTheme: "",
          GameSpeed: "",
          Oponent: null,
          Roll: null,
        });
      }
    }
  }, [isGameStarted, isGameFinished]);

  useEffect(() => {
    gameContext.gameSocket.on("game_started", () => {
      setIsGameStarted(true);
      setIsGameFinished(false);
    });

    gameContext.gameSocket.on("game_finished", (result: string) => {
      setIsGameStarted(false);
      setIsGameFinished(true);
      setresult(result);
      if (gameContext.gameDataInfo !== null) {
        gameContext.setgameDataInfo(null);
      } else if (gameData !== null) {
        setgameData(null);
        setGameState(null);
      }
    });
  }, []);

  useEffect(() => {
    if (gameContext.gameDataInfo !== null) {
      const payload: any = {
        player1_id: gameContext.gameDataInfo.gameInfo.player1_id,
        player2_id: gameContext.gameDataInfo.gameInfo.player2_id,
        speed: gameContext.gameDataInfo.gameInfo.speed,
        game_id: gameContext.gameDataInfo.gameInfo.game_id,
        mapType: gameContext.gameDataInfo.gameInfo.mapType,
      };
      setTimeout(() => {
        gameContext.gameSocket.emit("join_a_game", payload);
      }, 2500);
    }
  }, [gameContext.gameDataInfo]);

  return (
    <div className="content-height flex flex-col flex-no-wrap justify-around bg-[#0D0149]">
      {!isGameStarted && !isGameFinished && <GameWaiting />}
      {isGameStarted && (
        <ScoreBoardComponent
          gameState={gameState}
          Round={Round}
          UserScore={UserScore}
          ComputerScore={ComputerScore}
        ></ScoreBoardComponent>
      )}
      {isGameStarted && (
        <GameSceneComponent
          gameData={gameData}
          setIsGameStarted={setIsGameStarted}
          setIsGameFinished={setIsGameFinished}
          setresult={setresult}
          setRound={setRound}
          setUserScore={setUserScore}
          setComputerScore={setComputerScore}
        ></GameSceneComponent>
      )}
      {isGameFinished && <GameResult result={result} />}
    </div>
  );
}

export default GameDashboard;
