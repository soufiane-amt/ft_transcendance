'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Kanit } from "next/font/google";

const quotefont = Kanit({
  subsets: ['latin'],
  weight: ['400'],
});

export default function HomePageNav() {
  const [toggle, setToggle] = useState<boolean>(false);
  const close = "/close.png";
  const open = "/align.png"



  return (
    <nav className="bg-[#0D0149] flex justify-between items-center min-h-[105px] w-full">
      <Image src="/myWhiteLogo.png" width={129.5} height={105.7} alt="Logo" priority={true} className="px-[15px] lg:[50px]"/>
      <div className="lg:flex hidden items-center space-x-20 text-white ml-[50px] mr-[20px] font-bold  p-[2%]">
        <Link href="/" className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#333989] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>Home</Link>
        <Link href="/history" className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#333989] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>History</Link>
        <Link href="/about" className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}>About</Link>
      </div>
      <div className="lg:hidden flex flex-1 justify-end items-center ">
          <div className="mr-[15px] ml-[50px] w-[50px]">
            <Image src={toggle ? close : open} width={toggle ? 32 : 45} height={toggle ? 32 : 45} alt="Menu" className="object-contain" onClick={() => setToggle((prev) => !prev)} />
          </div>
          <div className={`${toggle ? 'flex  popup' : 'hidden'} p-6 bg-[#000000] bg-opacity-50 backdrop-blur-md absolute top-20 right-0 mx-4 my-2 min-w-[200px] min-h-[100px] rounded-xl flex-col space-y-5 text-white font-bold z-20`}>
            <Link href="/" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">Home</Link>
            <Link href="/history" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">History</Link>
            <Link href="/about" className="bg-[#DA343E] px-[20px] py-[5px] rounded-lg hover:bg-[#e36870]  text-center">About</Link>
          </div>
      </div>
    </nav>
  );
}




// nav bar other styling for larger screens on hover there is animation

{/* <Link href="/" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">Home</Link>
<Link href="/history" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">History</Link>
<Link href="/about" className="bg-[#DA343E] px-[20px] py-[5px] rounded-lg hover:bg-[#e36870]  text-center">About</Link> */}