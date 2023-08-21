'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePageNav() {
  const [toggle, setToggle] = useState<boolean>(false);
  const close = "/close.png";
  const open = "/align.png"



  return (
    <nav className="bg-[#0D0149]  w-full h-25 flex justify-between items-center">
      <Image src="/myWhiteLogo.png" width={129.5} height={105.7} alt="Logo" priority={true} className="px-[15px] lg:[50px]"/>
      <div className="lg:flex hidden items-center space-x-20 text-white ml-[50px] mr-[20px] font-bold">
        <Link href="/" className="bg-[#333989] px-[60px] py-[10px] rounded-lg duration-[0.4s] ease-in hover:bg-[#6a70c8] hover:scale-110 hover:shadow-[2px_1px_15px_1px_#333989]">Home</Link>
        <Link href="/history" className="bg-[#333989] px-[60px] py-[10px] rounded-lg duration-[0.4s] ease-in hover:bg-[#6a70c8] hover:scale-110 hover:shadow-[2px_1px_15px_1px_#333989]">History</Link>
        <Link href="/about" className="bg-[#DA343E] px-[60px] py-[10px] rounded-lg duration-[0.4s] ease-in hover:bg-[#e36870] hover:scale-110 hover:shadow-[2px_1px_15px_1px_#DA343E]">About</Link>
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
