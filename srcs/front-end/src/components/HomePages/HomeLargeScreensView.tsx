import { Press_Start_2P } from "next/font/google";
import { Kanit } from "next/font/google";
import Image from "next/image";


const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


const quotefont = Kanit({
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
            <div className={`${quotefont.className} p-[15px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-extrabold card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>Login with intra 42</div>
            <div className="w-[100%] h-[35%] relative">
                <Image src="/PongGameAnimation.png" alt="ping game" layout="fill" objectFit="contain"/>
            </div>
        </div>
    </div>
    );
}
