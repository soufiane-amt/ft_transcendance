import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";
import Link from "next/link";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HomeLargeScreensView() {
  return (
    <div className="2xl:flex hidden items-center justify-between w-full h-full p-[5%] overflow-auto">
      <div className="w-[50%] h-[100%] relative">
        <Image
          src="/PingPongTable.png"
          alt="ping game"
          layout="fill"
          objectFit="contain"
          className="min-w-[830px] min-h-[500px]"
        />
      </div>
      <div className="h-full flex items-center justify-between flex-col">
        <div className="mb-[50px]">
          <h2
            className={` text-white ${pixelfont.className} text-[80px] text-center`}
          >
            Retro
          </h2>
          <h2
            className={` text-white ${pixelfont.className} text-[60px] text-center`}
          >
            Ping Pong
          </h2>
        </div>
        <Link href={"http://localhost:3001/login"}>
          <HomePageIntraLoginButton />
        </Link>
        <div className="p-[10%]">
          <Image
            src="/PongGameAnimation.png"
            alt="ping game"
            width={350}
            height={60}
          />
        </div>
      </div>
    </div>
  );
}
