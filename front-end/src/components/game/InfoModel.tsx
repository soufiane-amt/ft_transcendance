import React from "react";
import { Space_Mono } from "next/font/google";
import "../../styles/TailwindRef.css";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function Info({ ...props }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[4]">
      {/* this is the backdrop (the background opacity) */}
      <div
        className="absolute bg-black w-full h-full opacity-50 z-[4]"
        onClick={(ev) => {
          ev.preventDefault();
          props.setInfo(false);
        }}
      ></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[80vw] h-[80vh] flex flex-col   p-[30px] box-border overflow-scroll items-center z-[5] min-h-[400px] min-w-[300px] max-h-[1500px] max-w-[720px]">
        <div className="flex items-center w-full flex-row-reverse h-[3%]">
          <img
            src="/close.png"
            alt="photo"
            className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.8em]"
            onClick={(ev) => {
              ev.preventDefault();
              props.setInfo(false);
            }}
          />
        </div>
        <div className="flex items-center flex-col h-[90%]">
          <div>
            <h3 className={` ${mono.className}`}>Info:</h3>
            <p className={` ${mono.className}`}>
              Welcome to our thrilling ping pong game! Whether you're a casual
              player or a seasoned pro, this is the perfect platform to showcase
              your skills and have a blast. We offer three exciting game modes
              to choose from: "Practice Mode" for solo practice against
              responsive AI opponents, "Invite Friends Mode" to challenge your
              friends, and "Matchmaking Mode" for engaging matches within our
              vibrant community. Grab your paddle and get ready to experience
              the excitement of virtual ping pong!
            </p>
          </div>
          <div>
            <h3 className={` ${mono.className}`}>Controls:</h3>
            <p className={` ${mono.className}`}>
              Use the Up Arrow to move your paddle up. Use the Down Arrow to
              move your paddle down.
            </p>
            <p className={` ${mono.className}`}>
              Move your mouse to control the position of your paddle.
            </p>
            <h3 className={`${mono.className}`}>Game Rules:</h3>
            <p className={` ${mono.className}`}>
              The game is played on a rectangular court with two paddles and a
              ball. You control one paddle (either with arrow keys or the
              mouse), while the computer controls the other. The game starts
              with the ball in the center of the court. Your goal is to prevent
              the ball from getting past your paddle while trying to score by
              getting the ball past your opponent's paddle. When the ball passes
              your opponent's paddle and goes off the screen on their side, you
              earn a point. The first player to reach 5 points wins the game.
            </p>
            <h3 className={`${mono.className}`}>Tips:</h3>
            <p className={` ${mono.className}`}>
              Try to predict the ball's trajectory and position your paddle
              accordingly to hit it. Don't let the ball get past your paddle, as
              that will result in your opponent scoring a point. Focus on both
              defense and offense, as you need to both prevent your opponent
              from scoring and try to score points yourself. Pong can be a
              fast-paced game, so be quick with your reactions. Enjoy playing
              Pong, and may the best player win!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
