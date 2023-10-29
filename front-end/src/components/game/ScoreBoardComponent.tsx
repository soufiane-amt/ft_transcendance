"use client"

import  Image from "next/image";
import "../../styles/TailwindRef.css";
import { useContext, useEffect, useState } from "react";
import gameDataContext, { GameData, GameDataContext } from "../GlobalComponents/GameDataContext";
import Cookies from "js-cookie";
import FetchPlayerData from "./UseFetch";

function ScoreBoardComponent() {
    const gamedatacontext: GameDataContext | null = useContext<GameDataContext | null>(gameDataContext);
    const [player1_avatar, setPlayer1_avatar] = useState("");
    const [player2_avatar, setPlayer2_avatar] = useState("");
    
    useEffect(() => {
        const JwtToken: any = Cookies.get('access_token');
        const player1_id: string = gamedatacontext?.gamePlayData.player1_id as string;
        const player2_id: string = gamedatacontext?.gamePlayData.player2_id as string;
        const fetchdata = async (): Promise<void> => {
            try {
                    const player1_data: any = await FetchPlayerData(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/game/user`, JwtToken, player1_id);
                    const player2_data: any = await FetchPlayerData(`${process.env.NEXT_PUBLIC_BACKEND_SERV}/game/user`, JwtToken, player2_id);
                    setPlayer1_avatar(player1_data.avatar);
                    setPlayer2_avatar(player2_data.avatar);
                } catch (error) {
                console.log(error);
            }
        }
        fetchdata();
    }, [])

    return (
        <div className="flex w-3/5 score-board-height justify-around flex-no-wrap items-center ml-auto mr-auto -mt-2 rounded-[45px] border-[1px] border-dashed border-[#E5E7FF] bg-[#333373] text-[#EAEAEF] Bangers-font -mt-[4%]">
            <div className="score-board-item-with border-[1px] border-solid border-[white] h-[80%] rounded-[50%] relative"><img className="w-full h-full rounded-[50%]" src={player1_avatar} alt={`${gamedatacontext?.gamePlayData.player1_username} picture`}/></div>
            <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around"> <div className="tracking-wider"> SCORE </div> <div> 15 </div> </div>
            <div className="tscore-board-item-with ext-center responsive-font min-w-0 h-4/5 flex flex-col justify-around"> <div className="tracking-wider"> USERNAME </div> <div> {gamedatacontext?.gamePlayData.player1_username} </div> </div>
            <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around"> <div className="tracking-wider"> ROUND </div> <div> 15 </div> </div>
            <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around"> <div className="tracking-wider"> USERNAME </div> <div> {gamedatacontext?.gamePlayData.player2_username} </div> </div>
            <div className="score-board-item-with text-center responsive-font min-w-0 h-4/5 flex flex-col justify-around"> <div className="tracking-wider"> SCORE </div> <div> 15 </div> </div>
            <div className="score-board-item-with border-[1px] border-solid border-[white] h-[80%] rounded-[50%] relative"><img className="w-full h-full rounded-[50%]" src={player2_avatar} alt={`${gamedatacontext?.gamePlayData.player2_username} picture`}/></div>
        </div>
    )
}

export default ScoreBoardComponent;