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

export default function HomeMediumScreensView() {
    return (
    <div className="sm:max-2xl:flex hidden  items-center flex-col w-full h-full justify-around  p-[5%]">
        <h1 className={`font-extrabold text-white ${pixelfont.className} text-[35px]`}>Retro Ping Pong</h1>
        <div className="w-[520px] h-[655px] relative">
            <Image src="/PingPongTable.png" alt="ping game" layout="fill" objectFit="contain"/>
        </div>
        <div className={`${quotefont.className} p-[15px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-extrabold card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>Login with intra 42</div>
    </div>
    );
}
