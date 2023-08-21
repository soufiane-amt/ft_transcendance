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

export default function HomeSmallScreensView() {
    return (
    <div className="sm:md:lg:hidden flex items-center flex-col w-full h-full justify-around">
        <div className="bg-[#DA343E] p-[15px] -rotate-12 rounded-md card-shadow w-fit h-fit]">
            <h2 className={`text-white text-center font-bold text-[50px]  ${pixelfont.className}`}>Retro</h2>
            <h2 className={`text-white text-center font-bold text-[20px] ${pixelfont.className}`}>Ping Pong</h2>
        </div>
        {/* here I will have the pong aniimation */}
        <div className="w-[80%] h-[30%] relative">
            <Image src="/PongGameAnimation.png" alt="ping game" layout="fill" objectFit="contain"/>
        </div>
        <div className={`${quotefont.className} p-[15px] w-[45%] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-extrabold card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>Login with intra 42</div>
    </div>
    );
}
