"use client";

import "../../styles/TailwindRef.css";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import FetchPlayerData from "./UseFetch";
import GameContext from "./GameContext";

import { Bangers } from "next/font/google";

const bangers = Bangers({
  preload: false,
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

function ScoreBoardComponent() {
  const gameContext: any = useContext<any>(GameContext);
  const [player1_avatar, setPlayer1_avatar] = useState("");
  const [player2_avatar, setPlayer2_avatar] = useState("");
  const [player1_score, setPlayer1_score] = useState<number>(0);
  const [player2_score, setPlayer2_score] = useState<number>(0);
  const [round, setNextRound] = useState<number>(1);

  useEffect(() => {
    gameContext.gameSocket.on("update_score", (side: string) => {
      if (side === "left") {
        setPlayer1_score((player1_score) => player1_score + 1);
      } else if (side === "right") {
        setPlayer2_score((player2_score) => +player2_score + 1);
      }
    });
    gameContext.gameSocket.on("move_next_round", () => {
      setNextRound((round) => round + 1);
      setPlayer1_score(0);
      setPlayer2_score(0);
    });
  }, []);

  useEffect(() => {
    const JwtToken: any = Cookies.get("access_token");
    const player1_id: string = gameContext.gameDataInfo.gameInfo
      .player1_id as string;
    const player2_id: string = gameContext.gameDataInfo.gameInfo
      .player2_id as string;
    const fetchdata = async (): Promise<void> => {
      try {
        const player1_data: any = await FetchPlayerData(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/game/user`,
          JwtToken,
          player1_id
        );
        const player2_data: any = await FetchPlayerData(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/game/user`,
          JwtToken,
          player2_id
        );
        setPlayer1_avatar(player1_data.avatar);
        setPlayer2_avatar(player2_data.avatar);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div
      className={`flex w-3/5 score-board-height justify-around flex-no-wrap items-center ml-auto mr-auto  rounded-[45px] border-[1px] border-dashed border-[#E5E7FF] bg-[#333373] text-[#EAEAEF] -mt-[4%] ${bangers.className}`}
    >
      <div className="score-board-item-with border-[1px] border-solid border-[white] h-[80%] rounded-[50%] relative">
        <img
          className="w-full h-full rounded-[50%]"
          src={player1_avatar}
          alt={`${gameContext.gameDataInfo.gameInfo.player1_username} picture`}
        />
      </div>
      <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around">
        {" "}
        <div className="tracking-wider"> SCORE </div>{" "}
        <div> {player1_score} </div>{" "}
      </div>
      <div className="tscore-board-item-with ext-center responsive-font min-w-0 h-4/5 flex flex-col justify-around">
        {" "}
        <div className="tracking-wider"> USERNAME </div>{" "}
        <div> {gameContext.gameDataInfo.gameInfo.player1_username} </div>{" "}
      </div>
      <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around">
        {" "}
        <div className="tracking-wider"> ROUND </div> <div> {round} </div>{" "}
      </div>
      <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around">
        {" "}
        <div className="tracking-wider"> USERNAME </div>{" "}
        <div> {gameContext.gameDataInfo.gameInfo.player2_username} </div>{" "}
      </div>
      <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around">
        {" "}
        <div className="tracking-wider"> SCORE </div>{" "}
        <div> {player2_score} </div>{" "}
      </div>
      <div className="score-board-item-with border-[1px] border-solid border-[white] h-[80%] rounded-[50%] relative">
        <img
          className="w-full h-full rounded-[50%]"
          src={player2_avatar}
          alt={`${gameContext.gameDataInfo.gameInfo.player2_username} picture`}
        />
      </div>
    </div>
  );
}

export default ScoreBoardComponent;
