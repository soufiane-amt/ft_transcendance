
import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import Image from "next/image";


const pixelfont = Press_Start_2P({
    subsets: ['latin'],
    weight: ['400'],
  });


const mono = Space_Mono({
    subsets: ['latin'],
    style: ['normal'],
    weight: ['400', '700'],
})
export default function HistorySmallScreenView() {
    return (
        <div className={`sm:lg:hidden flex justify-around items-center flex-col p-[5%] w-full h-full overflow-auto`}>
            <h1 className={`font-black text-[45px] text-[#343CFF] ${pixelfont.className}`}>History</h1>
            <div className="w-[70%] h-[45%] relative">
                <Image src="/PongCodeTheClassics.png" alt="ping game" layout="fill" objectFit="contain"/>
            </div>
            <p className={`${mono.className} text-[#0D0149] font-bold text-center`}>
                Pong, groundbreaking electronic game released in 1972 by the American game manufacturer Atari, Inc.
                One of the earliest video games, Pong became wildly popular and helped launch the video game industry.
                The original Pong consisted of two paddles that players used to volley a small ball back and forth across a screen.
            </p>
        </div>
    );
}