import { Press_Start_2P } from "next/font/google";
import Image from "next/image";
import HomePageIntraLoginButton from "./HomePageIntraLoginButton";


const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


export default function HomeMediumScreensView() {
    return (
    <div className="sm:max-2xl:flex hidden items-center justify-between flex-col h-full p-[5%] overflow-auto">
        <div className="flex items-center justify-center flex-col mt-[30px]">
            <h2 className={`text-white ${pixelfont.className} text-[70px]`}>Retro</h2>
            <h2 className={`text-white ${pixelfont.className} text-[50px]`}>Ping Pong</h2>
        </div>
        <Image src="/pingpong.png" alt="ping game" width={500} height={500} className="my-[40px]"/>
        <HomePageIntraLoginButton />
    </div>
    );
}
