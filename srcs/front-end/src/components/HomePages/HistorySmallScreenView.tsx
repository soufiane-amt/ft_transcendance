
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
        <div className={`sm:lg:hidden flex justify-evenly items-center flex-col p-[8%] gap-8`}>
            <h1 className={`text-[30px] text-[#343CFF] ${pixelfont.className}`}>History</h1>
            <Image src="/PongCodeTheClassics.png" alt="ping game" height={300} width={300}/>
            <p className={`${mono.className} text-[#0D0149] text-center text-[13px]`}>
                Pong, groundbreaking electronic game released in 1972 by the American game manufacturer Atari, Inc.
                One of the earliest video games, Pong became wildly popular and helped launch the video game industry.
                The original Pong consisted of two paddles that players used to volley a small ball back and forth across a screen.
            </p>
        </div>
    );
}
