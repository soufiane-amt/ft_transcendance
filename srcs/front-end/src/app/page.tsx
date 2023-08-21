import HomePageNav from "../components/HomePage/HomePageNav"
import { Press_Start_2P } from "next/font/google";
import { Kanit } from "next/font/google";

const pixelfont = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
});


const quotefont = Kanit({
  subsets: ['latin'],
  weight: ['400'],
});

export default function Home() {
  return (
    <div className="bg-[#0D0149] overflow-hidden w-full h-full">
      <HomePageNav />
      <main className="w-full h-75 custom">



        {/* this is mobile */}
        <div className="sm:hidden mt-10 flex items-center justify-between flex-col w-full h-full">
            <div className="bg-[#DA343E] p-[15px] -rotate-12 rounded-md card-shadow w-fit h-fit">
              <h2 className={`text-white text-center font-bold text-[50px]  ${pixelfont.className}`}>Retro</h2>
              <h2 className={`text-white text-center font-bold text-[20px] ${pixelfont.className}`}>Ping Pong</h2>
            </div>
          <div className=" justify-self-end p-[15px] w-80 text-center mx-[20px]  rounded-md text-[#0D0149] bg-white font-bold ">Login with intra 42</div>


        </div>





      </main>
    </div>
  );
}


// build home pages responsive for mobile
// TODO: working on mobile home page and why height doest not apply with tailwind and it does work with css custom