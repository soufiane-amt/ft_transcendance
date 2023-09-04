import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";
import Link from "next/link";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HomeSmallScreensView() {
  return (
    <div className="sm:hidden flex flex-col items-center justify-between h-full overflow-auto p-[5%]">
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
      <Image
        src="/PongGameAnimation.png"
        alt="ping game"
        width={300}
        height={175}
      />
      <Link href={"http://localhost:3001/login"}>
        <HomePageIntraLoginButton />
      </Link>
    </div>
  );
}
