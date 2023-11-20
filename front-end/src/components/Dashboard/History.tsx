"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import GameStatistics from "./interfaces/GameStatistics";

function History() {
  const [FriendHistory, setFriendHistory] = useState<GameStatistics[] | []>([]);
  const JwtToken = Cookies.get("access_token");

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_SERV}/api/Dashboard/friends/result`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${JwtToken}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setFriendHistory(data))
      .catch((error) => {
        // console.error("Error:", error);
      });
  }, [JwtToken]);
  return (
    <>
      <div className="informationaboutuser">
        {FriendHistory.map((history: GameStatistics) => {
          const [score_1, score_2] = history.result.split("-");
          const compositeKey = history.gameId;
          return (
            <div className="container-user friend" key={compositeKey}>
              <div className="information-user">
                <div>
                  <img src={history.user_avatar} alt="photo"></img>
                  <p>{history.user_username}</p>
                </div>
                {score_1 > score_2 && (
                  <img
                    src="high-score.png"
                    id="crown-score"
                    width={40}
                    height={40}
                    alt="photo"
                  ></img>
                )}
              </div>
              {score_1 > score_2 && (
                <div className="score-friend">
                  <p>Score</p>
                  <p>
                    <span>{score_1}</span>VS<span>{score_2}</span>
                  </p>
                </div>
              )}
              {score_1 < score_2 && (
                <div className="score-friend handle">
                  <p>Score</p>
                  <p>
                    <span>{score_1}</span>VS<span>{score_2}</span>
                  </p>
                </div>
              )}
              {score_1 == score_2 && (
                <div className="score-friend handle">
                  <p>Score</p>
                  <p>
                    <span>{score_1}</span>VS<span>{score_2}</span>
                  </p>
                </div>
              )}
              <div className="information-friend">
                {score_1 < score_2 && (
                  <img
                    src="high-score.png"
                    id="crown-score-friend"
                    width={40}
                    height={40}
                    alt="photo"
                  ></img>
                )}
                <div>
                  <img src={history.opponent_avatar} alt="photo"></img>
                  <p>{history.opponent_username}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default History;
