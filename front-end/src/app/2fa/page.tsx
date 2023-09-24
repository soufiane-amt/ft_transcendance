"use client";
import { Space_Mono } from "next/font/google";
import { useState} from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import "../../styles/Homepage.css";
import Lottie from "react-lottie-player";
import codeAnimation from "../../../public/CodeAnimation.json";
import axios from "axios";
import Cookies from "js-cookie";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

const Home = () => {
  const [code, setCode]: any = useState("");
  const TowFaToken = Cookies.get("twofa_token");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (event: any) => {
    setCode(event.target.value);
  };

  async function HandleSubmit(event: any) {
    event.preventDefault();
    try {
      const data = {
        twoFactorAuthenticationCode: code,
      };
      const response : any = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/2fa/login`,
        data,
        {
          headers: {
            Authorization: `Bearer ${TowFaToken}`,
          },
        }
      );
      console.log(response.data)
      if (response.status === 201) {
        Cookies.remove('twofa_token');
        Cookies.set('access_token', response.data.accessToken);
        router.push("/dashboard"); 
      }
    } catch (err) {
      setError("** Invalid Code **");
      setTimeout(() => setError(""), 1000);
      // console.clear();
    }
  }

  return (
    <div className="bg-gradient-to-br from-[#2003b0] via-[#0D0149] to-[#2003b0] min-w-[100vw] h-[100vh]  flex  items-center p-[5%] overflow-scroll flex-col">
      <motion.form
        className=" card-shadow w-[80vw]  h-[70vh] min-h-[600px] max-w-[600px] bg-[#ccc4f7] rounded-xl flex justify-evenly items-center text-[#0D0149] flex-col  my-auto p-[3%]"
        onSubmit={HandleSubmit}
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <h2
          className={`${mono.className} text-[#0D0149] text-center m-[8px] font-semibold text-[18px] mt-[25px]`}
        >
          Two Factor Authentication:
        </h2>
        <Lottie
          loop
          animationData={codeAnimation}
          play
          style={{ width: 220, height: 220 }}
        />
        <label htmlFor="qrcode" className="h-[90px]">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={handleChange}
            className={` mb-[20px] border-none h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6 card-shadow`}
            placeholder="Enter 6-digits"
            pattern="\d{6}"
            required
          />
          {error !== "" && (
            <p
              className={`${mono.className} text-rose-700 text-sm text-center`}
            >
              {error}
            </p>
          )}
        </label>
        <button
          type="submit"
          className={`text-[18px] font-semibold  bg-white px-[15px] py-[3px] rounded-xl hover:bg-[#0D0149] hover:text-white ${mono.className} mt-[20px] card-shadow  border-none  hover:cursor-pointer`}
        >
          Submit
        </button>
      </motion.form>
    </div>
  );
};

export default Home;
