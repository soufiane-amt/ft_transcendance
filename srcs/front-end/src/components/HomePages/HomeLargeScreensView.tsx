import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";



const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


export default function HomeLargeScreensView() {
    return (
    <div className="2xl:flex hidden  items-center h-full justify-around">
        <div className="w-[40%] h-[100%] relative">
            <Image src="/PingPongTable.png" alt="ping game" layout="fill" objectFit="contain"/>
        </div>
        <div className="w-[40%] h-[100%] flex items-center justify-around flex-col">
            <h1 className={`font-extrabold text-white ${pixelfont.className} text-[50px] w-[750px]`}>Retro Ping Pong</h1>
            <HomePageIntraLoginButton />
            <div className="w-[100%] h-[35%] relative">
                <Image src="/PongGameAnimation.png" alt="ping game" layout="fill" objectFit="contain"/>
            </div>
        </div>
    </div>
    );
}
