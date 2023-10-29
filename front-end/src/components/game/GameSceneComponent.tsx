import "../../styles/TailwindRef.css";

function GameSceneComponent() {
    
    return (
        <div className="ml-auto mr-auto bg-green-900 h-3/5 w-3/5 -mt-[11%] border-[1px] border-dashed  rounded-[20px] border-[#E5E7FF]">
            <canvas id="canvas"></canvas>
        </div>)
}

export default GameSceneComponent;