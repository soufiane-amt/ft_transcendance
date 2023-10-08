import { motion } from "framer-motion";

function BackgroundCircleMedium() {
  return (
    <motion.div
      className="absolute flex justify-center items-center mt-[0rem] ml-[0rem] z-0"
      initial={{
        opacity: 0,
      }}
      animate={{
        scale: [1, 2, 2, 3, 1],
        opacity: [0.2, 0.4, 0.6, 0.8, 0.1, 1.0],
      }}
      transition={{
        duration: 5.5,
      }}
    >
      <div className="absolute border-[1px] border-[#DA343E] border-solid  rounded-full h-[800px] w-[800px] animate-ping z-0"></div>
      <div className="absolute opacity-[60%]  border-[1px] border-white border-solid rounded-full  h-[600px] w-[600px] animate-ping z-0"></div>
      <div className="absolute opacity-[60%]  border-[1px] border-white border-solid  rounded-full h-[400px] w-[400px] animate-ping z-0"></div>
      <div className="absolute opacity-[60%]  border-[1px] border-white border-solid  rounded-full h-[200px] w-[200px] animate-ping z-0"></div>
      <div className="absolute  opacity-20 bg-slate-500 rounded-full h-[200px] w-[200px] z-0"></div>
      <div className="absolute  opacity-20 bg-slate-500 rounded-full h-[300px] w-[300px] z-0"></div>
    </motion.div>
  );
}

export default BackgroundCircleMedium;
