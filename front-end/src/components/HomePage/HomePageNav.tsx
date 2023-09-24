"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Kanit } from "next/font/google";

const quotefont = Kanit({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HomePageNav() {
  const [toggle, setToggle] = useState<boolean>(false);
  const close = "/close.png";
  const open = "/align.png";

  return (
    <nav className="bg-[#0D0149] flex justify-between items-center h-[90px] w-full fixed z-10">
      <Image
        src="/myWhiteLogo.png"
        width={110}
        height={95}
        alt="Logo"
        priority={true}
        className="p-[10px] mx-[1%]"
      />
      <div className="lg:flex hidden items-center space-x-20 text-white ml-[50px] mr-[20px] font-bold  p-[2%]">
        <Link
          href="#home"
          className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#333989] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer no-underline`}
        >
          Home
        </Link>
        <Link
          href="#history"
          className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#333989] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer no-underline`}
        >
          History
        </Link>
        <Link
          href="#about"
          className={`${quotefont.className} p-[10px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-black card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer no-underline`}
        >
          About
        </Link>
      </div>
      <div className="lg:hidden flex flex-1 justify-end items-center ">
        <div className="mr-[15px] ml-[50px] w-[50px]">
          <Image
            src={toggle ? close : open}
            width={toggle ? 32 : 45}
            height={toggle ? 32 : 45}
            alt="Menu"
            className="object-contain"
            onClick={() => setToggle((prev) => !prev)}
          />
        </div>
        <div
          className={`${
            toggle ? "flex  popup" : "hidden"
          } p-6 bg-[#000000] bg-opacity-50 backdrop-blur-md absolute top-[65px] right-0 mx-4 my-2 min-w-[200px] min-h-[100px] rounded-xl flex-col space-y-5 text-white font-bold`}
        >
          <Link
            href="#home"
            className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center no-underline text-white"
          >
            Home
          </Link>
          <Link
            href="#history"
            className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center no-underline text-white"
          >
            History
          </Link>
          <Link
            href="#about"
            className="bg-[#DA343E] px-[20px] py-[5px] rounded-lg hover:bg-[#e36870]  text-center no-underline text-white"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

// nav bar other styling for larger screens on hover there is animation

{
  /* <Link href="/" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">Home</Link>
<Link href="/history" className="bg-[#333989] px-[20px] py-[5px] rounded-lg hover:bg-[#6a70c8]  text-center">History</Link>
<Link href="/about" className="bg-[#DA343E] px-[20px] py-[5px] rounded-lg hover:bg-[#e36870]  text-center">About</Link> */
}
