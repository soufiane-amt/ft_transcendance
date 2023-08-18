import Image from "next/image";
import Link from "next/link";

export default function HomePageNav() {
  return (
    <div className="bg-[#0D0149]  h-[100px] flex justify-between items-center">
      <div className="m-[25px]">
        <Image src="/myWhiteLogo.png" width={119.5} height={95.7} alt="Logo" />
      </div>
      <div className="flex items-center justify-around w-[40%] text-white">
        <Link href="/">Home</Link>
        <Link href="/history">History</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
