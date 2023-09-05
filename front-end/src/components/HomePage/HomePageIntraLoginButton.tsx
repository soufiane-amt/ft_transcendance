import { Kanit } from "next/font/google";

const quotefont = Kanit({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HomePageIntraLoginButton() {
  return (
    <div
      className={`${quotefont.className} p-[15px] w-[195px] max-w-[226px] text-center mx-[20px]  rounded-md text-white bg-[#DA343E] font-extrabold card-shadow hover:border-white hover:bg-white hover:text-[#0D0149] hover:cursor-pointer`}
    >
      Login with intra 42
    </div>
  );
}
