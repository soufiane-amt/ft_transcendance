"use client"

import React, { useContext, useEffect, useState } from 'react'
import ScoreBoardComponent from './ScoreBoardComponent';
import GameSceneComponent from './GameSceneComponent';
import GameContext from './GameContext';
import { Socket } from 'socket.io-client';

function GameDashboard() {
  const gameContext: any = useContext<any>(GameContext);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isGameFinished, setIsGameFinished] = useState<boolean>(false);
  const [result, setresult] = useState("");

  const cleanUp = () => {
    const body : HTMLElement | null = document.body;
    body.style.overflow = 'scroll';
  }

  useEffect(() => {
    const body : HTMLElement | null = document.body;
    body.style.overflow = 'hidden';
    gameContext.gameSocket.on('game_started', () => {
      setIsGameStarted(true);
    });
    gameContext.gameSocket.on('game_finished', (result: string) => {
      setIsGameStarted(false);
      setIsGameFinished(true);
      setresult(result);
    })

    const payload: any = {
      player1_id: gameContext.gameDataInfo.gameInfo.player1_id,
      player2_id: gameContext.gameDataInfo.gameInfo.player2_id,
      speed: gameContext.gameDataInfo.gameInfo.speed,
      game_id: gameContext.gameDataInfo.gameInfo.game_id,
      mapType: gameContext.gameDataInfo.gameInfo.mapType
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