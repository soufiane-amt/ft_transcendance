"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

function History() {
  const [FriendHistory, setFriendHistory] = useState<
    { player_1_id: string; player_2_id: string; result: string }[]
  >([]);
  const JwtToken = Cookies.get("access_token");

  useEffect(() => {
    fetch("http://localhost:3001/api/Dashboard/friends/result", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JwtToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setFriendHistory(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [JwtToken]);
  return (
    <>
      <div className="informationaboutuser">
        {FriendHistory.map((history) => {
          const [score_1, score_2] = history.result.split("-");
          const compositeKey = `${history.player_1_id}-${history.player_2_id}-${score_1}-${score_2}`;
          return (
            <div className="container-user friend" key={compositeKey}>
              <div className="information-user">
                <div>
                  <img src="user.jpg" alt="photo"></img>
                  <p>{history.player_1_id}</p>
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
              <div className="score-friend">
                <p>Score</p>
                <p>
                  <span>{score_1}</span>VS<span>{score_2}</span>
                </p>
              </div>
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
                  <img src="images.png" alt="photo"></img>
                  <p>{history.player_2_id}</p>
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
