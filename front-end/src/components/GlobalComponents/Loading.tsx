import Lottie from "react-lottie-player";
import LoadingAnimation from "../../../public/LoadingAnimation.json";

export default function Loading() {
  return (
    <div className="loading">
      <Lottie
        loop
        animationData={LoadingAnimation}
        play
        style={{ width: 600, height: 600 }}
      />
    </div>
  );
}
