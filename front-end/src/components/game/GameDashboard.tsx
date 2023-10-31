"use client"

import React, { useContext, useEffect, useState } from 'react'
import gameDataContext, { GameData, GameDataContext } from '../GlobalComponents/GameDataContext'
import ScoreBoardComponent from './ScoreBoardComponent';
import GameSceneComponent from './GameSceneComponent';
import GameContext from './GameContext';
import { Socket } from 'socket.io-client';

function GameDashboard() {
  const gameContext: any = useContext<any>(GameContext);
  const gamedataContext: GameDataContext = useContext<GameDataContext>(gameDataContext);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [result, setresult] = useState("");

  const cleanUp = () => {
    const body : HTMLElement | null = document.body;
    body.style.overflow = 'scroll';
    const socket: Socket = gameContext.gameSocket;
    if (isGameStarted === true) {
      const payload: any = {
        side: gamedataContext.gamePlayData.side
      }
      socket.emit('leave_game', payload);
    }
  }

  useEffect(() => {
    const body : HTMLElement | null = document.body;
    body.style.overflow = 'hidden';
    gameContext.gameSocket.on('game_start', () => {
      setIsGameStarted(true);
    });
    gameContext.gameSocket.on('game_finished', (result: string) => {
      setIsGameStarted(false);
      setIsGameFinished(true);
      setresult(result);
    })
    setIsGameStarted(true);
    const payload: any = {
      player1_id: gamedataContext.gamePlayData.gameInfo.player1_id,
      player2_id: gamedataContext.gamePlayData.gameInfo.player2_id,
      speed: gamedataContext.gamePlayData.gameInfo.speed,
      game_id: gamedataContext.gamePlayData.gameInfo.game_id
    }
    gameContext.gameSocket.emit('join_a_game', payload);
    return () => cleanUp();
  }, []);

  return (
    <div className='content-height flex flex-col flex-no-wrap justify-around bg-[#0D0149]'>
      { !isGameStarted && !isGameFinished && <div> waiting </div> }
    	{ isGameStarted && <ScoreBoardComponent></ScoreBoardComponent> }
    	{ isGameStarted && <GameSceneComponent ></GameSceneComponent> }
      { isGameFinished && <div> {result} </div> }
	</div>
  )
}

export default GameDashboard;