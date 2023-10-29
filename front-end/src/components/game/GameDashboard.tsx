import React, { useContext, useEffect } from 'react'
import gameDataContext, { GameData, GameDataContext } from '../GlobalComponents/GameDataContext'
import ScoreBoardComponent from './ScoreBoardComponent';
import GameSceneComponent from './GameSceneComponent';

function GameDashboard() {
  const gameData: GameDataContext | null = useContext<GameDataContext | null>(gameDataContext);

  useEffect(() => {
    const body : HTMLElement | null = document.body;
    body.style.overflow = 'hidden';
    return () => { body.style.overflow = 'scroll' };
  }, []);

  return (
    <div className='content-height flex flex-col flex-no-wrap justify-around bg-[#0D0149]'>
    	<ScoreBoardComponent></ScoreBoardComponent>
    	<GameSceneComponent></GameSceneComponent>
	</div>
  )
}

export default GameDashboard;