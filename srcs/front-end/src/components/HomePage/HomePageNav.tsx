import Image from "next/image";
import Link from "next/link";

export default function HomePageNav() {
  return (
    <div className="bg-[#0D0149]  h-[100px] flex justify-between items-center">
      <div className="m-[25px] w-[20%]">
        <Image src="/myWhiteLogo.png" width={119.5} height={95.7} alt="Logo" priority={true}/>
      </div>
      <div className="flex items-center justify-around w-[40%] text-white">
        <Link href="/" className="bg-[#333989] px-[60px] py-[10px] rounded-lg hover:bg-white hover:text-black">Home</Link>
        <Link href="/history" className="bg-[#333989] px-[60px] py-[10px] rounded-lg hover:bg-white hover:text-black">History</Link>
        <Link href="/about" className="bg-[#DA343E] px-[60px] py-[10px] rounded-lg hover:bg-white hover:text-black">About</Link>
      </div>
    </div>
  );
}


// TODO: SEARCH FOR RESPONSIVE IN TALIWIND CSS WITH NAV BAR
// READ MORE ABOUT NEXT AND FETCHING DATA