import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import AboutPersonInfo from "./AboutPersonInfo";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function MobileView() {
  return (
    <div>
      <section
        id="home"
        className="bg-[#0D0149] flex flex-col items-center justify-around min-h-[100vh] p-[5%] pt-[90px]"
      >
        <div className="bg-[#DA343E] p-[15px] -rotate-12 rounded-md card-shadow w-fit h-fit my-[30px]">
          <h2
            className={`text-white text-center font-bold text-[50px]  ${pixelfont.className}`}
          >
            Retro
          </h2>
          <h2
            className={`text-white text-center font-bold text-[20px] ${pixelfont.className}`}
          >
            Ping Pong
          </h2>
        </div>
        {/* here I will have the pong aniimation */}
        <div className="min-h-[280px] flex justify-center items-center">
          <Image
            src="/PongGameAnimation.png"
            alt="ping game"
            width={200}
            height={175}
          />
        </div>
        <Link href={"http://localhost:3001/login"}>
          <HomePageIntraLoginButton />
        </Link>
      </section>
      <section
        id="history"
        className="bg-[#EFECFF] min-h-[100vh] p-[5%] flex flex-col items-center justify-evenly py-[90px]"
      >
        <h2 className={`text-[30px] text-[#343CFF] ${pixelfont.className}`}>
          History
        </h2>
        <Image
          src="/PongCodeTheClassics.png"
          alt="ping game"
          height={300}
          width={300}
          className="my-[30px]"
        />
        <div className="flex gap-8 flex-col">
          <p
            className={`${mono.className} text-[#0D0149] text-center text-[16px]`}
          >
            Pong, a simple yet groundbreaking game, was released in 1972 by the
            American game manufacturer Atari, Inc. It was one of the earliest
            video games and its popularity helped to launch the video game
            industry. The original Pong consisted of two paddles that players
            used to volley a small ball back and forth across a screen.
          </p>
          <p
            className={`${mono.className} text-[#0D0149] text-center text-[16px]`}
          >
            The game was created by Allan Alcorn as a training exercise assigned
            to him by Atari co-founder Nolan Bushnell. Bushnell and Atari
            co-founder Ted Dabney were surprised by the quality of Alcorn’s work
            and decided to manufacture the game. The concept of the game was
            based on an electronic ping-pong game included in the Magnavox
            Odyssey, which was the first home video game console.
          </p>
          <p
            className={`${mono.className} text-[#0D0149] text-center text-[16px]`}
          >
            In response to Pong’s success, Magnavox later sued Atari for patent
            infringement. Despite this, Pong was the first commercially
            successful video game, and it helped establish the video game
            industry along with the Magnavox Odyssey. After its release, several
            companies began producing games that closely mimicked its gameplay.
          </p>
          <p
            className={`${mono.className} text-[#0D0149] text-center text-[16px]`}
          >
            During the 1975 Christmas season, Atari released a home version of
            Pong exclusively through Sears retail stores. The home version was
            also a commercial success and led to numerous clones. The game has
            been remade on numerous home and portable platforms following its
            release. Today, Pong is part of the permanent collection of the
            Smithsonian Institution in Washington, D.C., due to its cultural
            impact.
          </p>
        </div>
      </section>
      <section
        id="about"
        className="bg-[#0D0149] min-h-[100vh] flex justify-evenly items-center flex-col gap-8 p-[5%] text-white pt-[90px]"
      >
        <h2 className={`text-[30px] ${pixelfont.className}`}>About</h2>
        <p className={`${mono.className} text-center text-[16px]`}>
          The project ft_transcendence is a website creation project focused on
          implementing a multiplayer online game of Pong. The website provides a
          user-friendly interface, a chat feature, and real-time gameplay. The
          project has specific requirements, such as using NestJS for the
          backend, a TypeScript framework for the frontend, and a PostgreSQL
          database. Security concerns, including password hashing and protection
          against SQL injections, must be addressed. User accounts involve login
          through the OAuth system of 42 intranet, profile customization,
          two-factor authentication, friend management, and displaying user
          stats. The chat feature includes channel creation, direct messaging,
          blocking users, and game invitations. The game itself should be a
          faithful representation of the original Pong, with customization
          options and responsiveness to network issues. The project submission
          and evaluation process follow the standard Git repository workflow.
        </p>
        <h2 className={`text-[30px] ${pixelfont.className}`}>Team</h2>
        <div className="flex items-center flex-col w-full">
          <div className="flex items-center justify-evenly  min-h-1/2 w-full my-[35px]">
            <AboutPersonInfo
              Picture="/Abdellah.jpg"
              TwitterLink="https://twitter.com/withabdellah"
              LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
              GithubLink="https://www.github.com/AbdellahBellakrim"
            />
            <AboutPersonInfo
              Picture="/Abdellah.jpg"
              TwitterLink="https://twitter.com/withabdellah"
              LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
              GithubLink="https://www.github.com/AbdellahBellakrim"
            />
          </div>
          <div className="flex items-center justify-evenly min-h-1/2 w-full my-[35px]">
            <AboutPersonInfo
              Picture="/Abdellah.jpg"
              TwitterLink="https://twitter.com/withabdellah"
              LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
              GithubLink="https://www.github.com/AbdellahBellakrim"
            />
            <AboutPersonInfo
              Picture="/Abdellah.jpg"
              TwitterLink="https://twitter.com/withabdellah"
              LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
              GithubLink="https://www.github.com/AbdellahBellakrim"
            />
          </div>
        </div>
        <h6 className={`${mono.className} text-center text-[13px] my-[30px]`}>
          © 2023 retro ping pong. All rights reserved.
        </h6>
      </section>
    </div>
  );
}
