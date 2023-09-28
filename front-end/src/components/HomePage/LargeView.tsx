import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";
import { Space_Mono } from "next/font/google";
import Link from "next/link";
import AboutPersonInfo from "./AboutPersonInfo";
import Lottie from "react-lottie-player";
import PaddleAnimation from "../../../public/AnimationPong.json";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import BackgroundCircle from "./BackgroundCircle";
import { useInView } from "react-intersection-observer";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function LargeView() {
  const [text] = useTypewriter({
    words: ["Are you up for the challenge?"],
    loop: true,
    delaySpeed: 2000,
  });

  const [ref, inView] = useInView({
    triggerOnce: false, // Trigger the animation only once
  });
  return (
    <div className="flex flex-col items-center">
      <section
        id="home"
        className="overflow-hidden w-full flex justify-center items-center"
      >
        <div className="bg-[#0D0149] min-h-[100vh] pb-[5%] pt-[90px] max-w-[1920px] flex flex-row gap-[250px] relative">
          <motion.div
            className="flex justify-evenly items-center flex-col mt-[50px] relative"
            initial={{
              x: -500,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.5,
            }}
          >
            <BackgroundCircle />
            <Lottie
              loop
              animationData={PaddleAnimation}
              play
              style={{ width: 600, height: 600 }}
            />
          </motion.div>

          <motion.div
            className="flex items-center justify-around flex-col mt-[50px] gap-[100px]"
            initial={{
              x: 500,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.5,
            }}
          >
            <h2
              className={`text-white text-center font-bold text-[50px]  ${pixelfont.className}`}
            >
              Let&apos;s Play!
            </h2>
            <p
              className={`${pixelfont.className} text-white text-[16px] w-[600px] leading-10 text-center`}
            >
              Get ready to unleash your paddle prowess in the ultimate game of
              precision and reflexes! Welcome to Pong Paradise, where the
              classic game of ping pong comes to life in a pixel-perfect
              showdown. Bounce, smash, and rally your way to victory in this
              timeless arcade sensation.
              <br />
              {text}
              <Cursor cursorColor="#DA343E" cursorStyle="_" />
            </p>
            <Link href={`${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/login`}>
              <HomePageIntraLoginButton />
            </Link>
          </motion.div>
        </div>
      </section>
      <section
        id="history"
        className="bg-[#EFECFF] w-full flex items-center justify-center"
      >
        <div className="min-h-[100vh] pb-[5%] pt-[90px] flex justify-evenly items-center flex-col max-w-[1920px] overflow-hidden">
          <h2
            className={`text-[50px] text-[#0D0149] ${pixelfont.className} mb-[30px]`}
          >
            History
          </h2>
          <div className="flex items-center justify-evenly gap-x-14">
            <div className="flex justify-normal items-start flex-col gap-y-8 w-[40%]">
              <p className={`${mono.className} text-[#0D0149] text-[16px]`}>
                Pong, a simple yet groundbreaking game, was released in 1972 by
                the American game manufacturer Atari, Inc. It was one of the
                earliest video games and its popularity helped to launch the
                video game industry. The original Pong consisted of two paddles
                that players used to volley a small ball back and forth across a
                screen.
              </p>
              <p className={`${mono.className} text-[#0D0149] text-[16px]`}>
                The game was created by Allan Alcorn as a training exercise
                assigned to him by Atari co-founder Nolan Bushnell. Bushnell and
                Atari co-founder Ted Dabney were surprised by the quality of
                Alcorn’s work and decided to manufacture the game. The concept
                of the game was based on an electronic ping-pong game included
                in the Magnavox Odyssey, which was the first home video game
                console.
              </p>
              <p className={`${mono.className} text-[#0D0149] text-[16px]`}>
                In response to Pong’s success, Magnavox later sued Atari for
                patent infringement. Despite this, Pong was the first
                commercially successful video game, and it helped establish the
                video game industry along with the Magnavox Odyssey. After its
                release, several companies began producing games that closely
                mimicked its gameplay.
              </p>
              <p className={`${mono.className} text-[#0D0149] text-[16px]`}>
                During the 1975 Christmas season, Atari released a home version
                of Pong exclusively through Sears retail stores. The home
                version was also a commercial success and led to numerous
                clones. The game has been remade on numerous home and portable
                platforms following its release. Today, Pong is part of the
                permanent collection of the Smithsonian Institution in
                Washington, D.C., due to its cultural impact.
              </p>
            </div>
            {/* <Image
              src="/PongCodeTheClassics.png"
              alt="ping game"
              width={450}
              height={400}
            /> */}
            <motion.img
              initial={{
                x: 500,
                opacity: 0,
              }}
              whileInView={{
                x: 0,
                opacity: 1,

              }}
              viewport={{once: true}}
              transition={{
                duration: 1,
              }}
              src="/PongCodeTheClassics.png"
              className="w-[450px] h-[550px] rounded-xl"
            />
          </div>
        </div>
      </section>
      <section
        id="about"
        className="bg-[#0D0149]  text-white min-h-[100vh] max-w-[1920px] flex items-center flex-col justify-around gap-36 px-[5%] pt-[90px] pb-[2%] overflow-hidden"
      >
        <div className="flex items-center justify-between gap-16 w-full mt-[20px]">
          <p className={`${mono.className} text-[16px]  w-8/12`}>
            The project ft_transcendence is a website creation project focused
            on implementing a multiplayer online game of Pong. The website
            provides a user-friendly interface, a chat feature, and real-time
            gameplay. The project has specific requirements, such as using
            NestJS for the backend, a TypeScript framework for the frontend, and
            a PostgreSQL database. Security concerns, including password hashing
            and protection against SQL injections, must be addressed. User
            accounts involve login through the OAuth system of 42 intranet,
            profile customization, two-factor authentication, friend management,
            and displaying user stats. The chat feature includes channel
            creation, direct messaging, blocking users, and game invitations.
            The game itself should be a faithful representation of the original
            Pong, with customization options and responsiveness to network
            issues. The project submission and evaluation process follow the
            standard Git repository workflow.
          </p>
          <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className={`text-[50px] ${pixelfont.className}`}
          >
            About
          </motion.h2>
        </div>

        <div className="flex items-center justify-between gap-8 w-full">
        <motion.h2
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.5 }}
            className={`text-[50px] ${pixelfont.className}`}
          >
            Team
          </motion.h2>
          <div className="flex items-center justify-between gap-24 w-8/12">
            <AboutPersonInfo
              Picture="/Abdellah.jpg"
              TwitterLink="https://twitter.com/withabdellah"
              LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
              GithubLink="https://www.github.com/AbdellahBellakrim"
            />
            <AboutPersonInfo
              Picture="/Zakaria.jpg"
              TwitterLink="https://twitter.com/"
              LinkedinLink="https://www.linkedin.com/in/zakaria-aabou-a13098208/"
              GithubLink="https://github.com/Ziko909"
            />
            <AboutPersonInfo
              Picture="/Oussama.jpg"
              TwitterLink="https://twitter.com/DakhchO"
              LinkedinLink="https://www.linkedin.com/in/oussama-dakhch-608964257/"
              GithubLink="https://www.github.com/DakhchOussama"
            />
            <AboutPersonInfo
              Picture="/Soufyane.jpg"
              TwitterLink="https://twitter.com/"
              LinkedinLink="https://www.linkedin.com/in/soufiane-amajat-6a828b197/"
              GithubLink="https://www.github.com/soufiane-amt"
            />
          </div>
        </div>
        <h6 className={`${mono.className} text-center text-[13px]`}>
          © 2023 retro ping pong. All rights reserved.
        </h6>
      </section>
    </div>
  );
}
