import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";


const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


export default function HomeMediumScreensView() {
    return (
    <div className="sm:max-2xl:flex hidden  items-center flex-col w-full h-full justify-around  p-[38px]">
        <h1 className={`font-extrabold text-white ${pixelfont.className} text-[35px]`}>Retro Ping Pong</h1>
        <div className="w-[520px] h-[655px] relative">
            <Image src="/PingPongTable.png" alt="ping game" layout="fill" objectFit="contain"/>
        </div>
        <HomePageIntraLoginButton />
    </div>
    );
}
