"use client";
import { Space_Mono } from "next/font/google";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import withAuth from "@/components/GlobalComponents/HigherOrderComponent";
import "../../styles/Homepage.css";

const mono = Space_Mono({
  preload: false,
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

const Home = () => {
  const [User, setUser] = useState<any>({});
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [ProfilePicture, setProfilePicture]: any = useState(null);
  const [ProfileSrc, setProfileSrc]: any = useState("");
  const FileInput: any = useRef();
  const router = useRouter();
  const jwtToken = Cookies.get("access_token");

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setUser(response.data);
        setProfileSrc(response.data.avatar);
      } catch (error) {
        console.log(error);
      }
    }
    getUserData();
  }, [jwtToken]);

  const HandleSubmit = async (event: any) => {
    event.preventDefault();

    const Data: any = new FormData();
    Data.append("FirstName", FirstName);
    Data.append("LastName", LastName);
    Data.append("ProfilePicture", ProfilePicture);

    try {
      if (!ProfilePicture) setError("Select an image");
      else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_SERV}/auth/updatecredentials`,
          Data,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );
        if (response.status === 201) router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(`\n error: ${error}\n`);
      if (error.response && error.response.status === 415)
        setError("invalid file type");
      console.clear();
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <div className="bg-gradient-to-br from-[#2003b0] via-[#0D0149] to-[#2003b0] min-w-[100vw] h-[100vh]  flex  items-center p-[5%] overflow-scroll flex-col myclass">
      <motion.form
        className=" card-shadow w-[80vw]  h-[70vh] min-h-[600px] max-h-[800px] max-w-[600px] bg-[#ccc4f7] rounded-xl flex justify-evenly items-center text-[#0D0149] flex-col  my-auto p-[3%]"
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
        <h1
          className={`${mono.className} text-[#0D0149] text-center m-[8px] font-semibold text-[18px] mt-[25px]`}
        >
          Want to update Credentials?
        </h1>
        <label
          className=" m-[8px] w-[190px] h-[190px] flex items-center justify-center flex-col"
          htmlFor="avatar"
        >
          {" "}
          <div className="flex justify-center items-center w-[170px] h-[170px] mb-[6px]">
            {User && (
              <img
                src={ProfileSrc || "/ProfileUser.png"}
                width={160}
                height={160}
                alt="Profile Pic"
                className=" card-shadow rounded-full  hover:cursor-pointer hover:w-[155px] hover:h-[155px] w-[160px] h-[160px]"
              />
            )}
          </div>
          {error && (
            <p className={`${mono.className} text-rose-700 text-sm`}>{error}</p>
          )}
          <input
            type="file"
            name="ProfilePicture"
            id="avatar"
            accept="image/*"
            ref={FileInput}
            className="hidden"
            onChange={(e: any) => {
              setProfilePicture(e.target.files[0]);
              setError("");
              if (e.target.files[0]) {
                const reader = new FileReader();
                reader.onloadend = () => {
                  setProfileSrc(reader.result);
                };
                reader.readAsDataURL(e.target.files[0]);
              }
            }}
          />
        </label>
        <div className=" w-[80%] h-[40%] flex flex-col justify-evenly m-[8px]">
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              name="FirstName"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6 card-shadow border-none`}
              placeholder="First Name"
              required
              value={FirstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className="flex flex-col text-center h-[45px] mt-[15px]">
            <input
              type="text"
              name="LastName"
              className={`h-[40px] rounded-xl ${mono.className} placeholder:text-slate-400 pl-[20px] focus:outline-none focus:translate-x-6 card-shadow  border-none`}
              placeholder="Last Name"
              required
              value={LastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <button
          type="submit"
          className={`text-[18px] font-semibold  bg-white px-[15px] py-[3px] rounded-xl hover:bg-[#0D0149] hover:text-white ${mono.className} mt-[20px] card-shadow  border-none  hover:cursor-pointer`}
        >
          Submit
        </button>

        <button
          type="button"
          onClick={handleSkip}
          className={`text-[18px] font-semibold text-gray-950 hover:opacity-30 ${mono.className} m-[20px]  border-none bg-transparent hover:cursor-pointer`}
        >
          Skip
        </button>
      </motion.form>
    </div>
  );
};

export default withAuth(Home);
