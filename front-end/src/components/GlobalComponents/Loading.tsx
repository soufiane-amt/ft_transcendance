import Lottie from "react-lottie-player";
import LoadingAnimation from "../../../public/LoadingAnimation.json";

export default function Loading() {
  return (
    <div className="w-[100vw] h-[100vh] bg-[#ccc4f7] flex justify-center items-center">
      <Lottie
        loop
        animationData={LoadingAnimation}
        play
        style={{ width: 600, height: 600 }}
      />
    </div>
  );
}
