import React, { useContext, useEffect }  from "react";
import Lottie from "react-lottie-player";
import LoadingAnimation from '@/../public/MatchMakingAnimation.json'
import { Button } from 'antd';
import GameContext from "./GameContext";


function MatchMakingLoadingComponent(props : any) {
    const gameContext: any = useContext(GameContext);

    const handleCancel = (props : any) => {
        props.setIsMatchMakingLoading(false);
        const payload: any = { role: gameContext.GameSettings.Roll }
        gameContext.gameSocket.emit('leave MatchMakingSystem', payload);
    }

    useEffect(() => {
        const body : HTMLElement | null = document.body;
        body.style.overflow = 'hidden';
        return () => { body.style.overflow = 'scroll' };
    }, [])

    return (
        <div className="h-full w-full bg-indigo-100 absolute flex items-center justify-start flex-col flex-wrap z-40 top-0 overflow-hidden">
        <Lottie className="h-3/5"
            animationData={LoadingAnimation}
            loop={true}
            play={true}
            />
            <h2 className="relative  text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">Looking For An opponent</h2>
        <Button onClick={() => handleCancel(props) } className="mt-5" size="large" type="primary" danger>
            cancel
        </Button>
        </div>
    )
}

export default MatchMakingLoadingComponent;