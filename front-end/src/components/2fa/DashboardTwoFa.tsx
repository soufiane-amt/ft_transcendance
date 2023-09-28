import "../../styles/TailwindRef.css";
import Lottie from "react-lottie-player";
import codeAnimation from "../../../public/QrAnimation.json";
import { Space_Mono } from "next/font/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

function DashboardTwoFa(props: any) {
  const jwtToken = Cookies.get("access_token");
  const [qrcodeimg, setqrcodeimg] = useState("");
  const [code, setCode] = useState("");
  const [error, setError]: any = useState("");
  const [user, setUser]: any = useState(null);

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
      } catch (error) {
        // console.log(error);
        console.clear();
      }
    }
    getUserData();
  }, [jwtToken, user]);

  const handleChange = (event: any) => {
    setCode(event.target.value);
  };

  async function HandleGenerate(event: any) {
    event.preventDefault();
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/2fa/generate`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          responseType: "arraybuffer",
        }
      );
      const base64 = Buffer.from(response.data, "binary").toString("base64");
      setqrcodeimg(`data:image/png;base64,${base64}`);
    } catch (err) {
      console.log(`${err}`);
    }
  }

  async function HandleActivate(event: any) {
    event.preventDefault();
    try {
      const data = {
        twoFactorAuthenticationCode: code,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/2fa/activate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // console.log(response);
    } catch (err) {
      setError("** Invalid Code **");
      setTimeout(() => setError(""), 1000);
      console.clear();
    }
  }

  async function HandleDesactivate(event: any) {
    event.preventDefault();
    try {
      const data = {
        twoFactorAuthenticationCode: code,
      };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_SERV}/2fa/desactivate`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      // console.log(response);
    } catch (err) {
      setError("** Invalid Code **");
      setTimeout(() => setError(""), 1000);
      console.clear();
    }
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ zIndex: '50'}}>
      {/* this is the backdrop (the background opacity) */}
      <div className="absolute bg-black opacity-50"></div>
      {/* this is the main component */}
      <div className="bg-[#E4E7FF] rounded shadow-lg w-[95vw] h-[90vh] flex flex-col   p-[20px] box-border overflow-scroll items-center">
        <div className="flex items-center w-full flex-row-reverse h-[3%]">
          <img
            src="/close.png"
            className="w-[20px] h-[20px] hover:cursor-pointer mt-[-1em] mr-[-0.5em]"
            onClick={(ev) => {
              ev.preventDefault();
              props.setTwoFa(false);
            }}
          />
        </div>


        <div className="w-full md:max-w-[800px] h-[97%] flex flex-col">
          <div className="m-[8px] mb-[20px] ">
            <h2 className={`${mono.className} text-sm`}>
              Two-Factor Authentication (2Fa) Setup
            </h2>
            <p className={`${mono.className} text-sm`}>
              We take security seriously! To enhance the security of your
              account, we require you to set up Two-Factor Authentication (2FA).
            </p>
            <p className={`${mono.className} text-sm`}>
              2FA adds an extra layer of protection to your account by requiring
              you to enter a unique verification code, in addition to your
              password, each time you sign in.
            </p>
            <p className={`${mono.className} text-sm`}>
              To get started, you will need to install the Google Authenticator
              app on your mobile device. Google Authenticator generates the
              verification codes for your account.
            </p>
            <h2 className={`${mono.className} text-sm`}>
              How to set up 2FA using Google Authenticator:
            </h2>
            <ol className={`list-decimal ml-6 ${mono.className}`}>
              <li className={`${mono.className} text-sm`}>
                Click generate to generate QR code for your account
              </li>
              <li className={`${mono.className} text-sm`}>
                Open the Google Authenticator app on your mobile device.
              </li>
              <li className={`${mono.className} text-sm`}>
                Scan the QR code displayed on the screen with the app
              </li>
              <li className={`${mono.className} text-sm`}>
                Once scanned, Google Authenticator will generate a 6-digit
                verification code.
              </li>
              <li className={`${mono.className} text-sm`}>
                Enter the verification code in the box below to complete the
                setup.
              </li>
              <li className={`${mono.className} text-sm`}>
                Click Activate or desactivate !
              </li>
            </ol>
          </div>
          {/* <hr className="h-[3px] bg-black opacity-50 rounded-full border-none m-[15px]" /> */}

          <div className="flex  flex-col justify-evenly items-center md:flex-row  mb-[15px]  gap-8">
            <div className=" h-full flex flex-col items-center md:gap-12">
              <h3 className={`${mono.className} text-sm mb-[20px]`}>
                Scan this Qr Code:
              </h3>
              <div className="flex flex-col items-center h-[260px]">
                {qrcodeimg === "" && (
                  <Lottie
                    loop
                    animationData={codeAnimation}
                    play
                    style={{ width: 220, height: 220 }}
                  />
                )}

                {qrcodeimg !== "" && <img src={qrcodeimg} alt="qrcode" />}
              </div>
              <button
                onClick={HandleGenerate}
                className={`${mono.className} font-semibold rounded-xl text-sm border-none bg-[#0D0149] text-white px-[18px] py-[8px] card-shadow hover:cursor-pointer hover:bg-white hover:text-[#0D0149]`}
              >
                Generate
              </button>
            </div>
            {/* <hr className="h-[3px] bg-black opacity-50 rounded-full border-none m-[15px]" /> */}
            <form className="flex flex-col  items-center h-full md:gap-32  gap-8">
              <h3 className={`${mono.className} text-sm mb-[20px]`}>
                Enter 6-digits of verification code:
              </h3>
              <label htmlFor="qrcode">
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
                <div className="h-[40px]">
                  {error !== "" && (
                    <p
                      className={`${mono.className} text-rose-700 text-sm text-center`}
                    >
                      {error}
                    </p>
                  )}
                  {user && user.isTwoFactorAuthenticationEnabled && (
                    <p
                      className={`${mono.className} text-green-700 text-sm text-center`}
                    >
                      2Fa Enabled
                    </p>
                  )}
                  {user && !user.isTwoFactorAuthenticationEnabled && (
                    <p
                      className={`${mono.className} text-red-700 text-sm text-center`}
                    >
                      2Fa Disabled
                    </p>
                  )}
                </div>
              </label>
              <div className="flex justify-evenly w-full  mb-[20px] gap-14 md:gap-24">
                <button
                  onClick={HandleDesactivate}
                  className={`${mono.className} font-semibold rounded-xl text-sm border-none bg-[#862323] text-white px-[18px] py-[8px] card-shadow hover:cursor-pointer hover:bg-white hover:text-[#0D0149] outline-none`}
                >
                  Desactivate
                </button>
                <button
                  onClick={HandleActivate}
                  className={`${mono.className} font-semibold rounded-xl text-sm border-none bg-[#23834e] text-white px-[18px] py-[8px] card-shadow hover:cursor-pointer hover:bg-white hover:text-[#0D0149]  outline-none`}
                >
                  Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardTwoFa;
