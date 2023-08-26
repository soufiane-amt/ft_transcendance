import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";


const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


export default function HomeMediumScreensView() {
    return (
    <div className="sm:max-2xl:flex hidden  items-center flex-col w-full h-full justify-around  p-[5%] gap-16">
        <div className="flex items-center justify-center flex-col">
            <h2 className={`text-white ${pixelfont.className} text-[45px]`}>Retro</h2>
            <h2 className={`text-white ${pixelfont.className} text-[45px]`}>Ping Pong</h2>
        </div>
        <Image src="/PingPongTable.png" alt="ping game" width={520} height={350}/>
        <HomePageIntraLoginButton />
    </div>
    );
}
