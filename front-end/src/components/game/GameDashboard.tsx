import React, { useContext, useEffect } from 'react'
import gameDataContext, { GameData, GameDataContext } from '../GlobalComponents/GameDataContext'

function GameDashboard() {
  const gameData: GameDataContext | null = useContext<GameDataContext | null>(gameDataContext);
  
  return (
    <div>
    <div>{gameData?.gamePlayData.game_id}</div>
    <div>{gameData?.gamePlayData.mapType}</div>
    <div>{gameData?.gamePlayData.player1_id}</div>
    <div>{gameData?.gamePlayData.player1_username}</div>
    <div>{gameData?.gamePlayData.player2_id}</div>
    <div>{gameData?.gamePlayData.player2_username}</div>
    </div>
  )
}

export default GameDashboard