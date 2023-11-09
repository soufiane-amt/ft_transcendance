import React from 'react';
import style from './SideBarItem.module.css';

interface SideBarItemProps{
    handleNavigation: () => void,
    data: {icon: string, name: string},
    activateShrinkMode:boolean
}

function SideBarItem ({handleNavigation, data, activateShrinkMode}: SideBarItemProps) {
    return (
        <div className={style.side_bar_item} onClick={handleNavigation}>
            <div className={style.side_bar_item__icon}>
                <img src={data.icon} alt="icon " />
            </div>
            {
                activateShrinkMode===false &&
                <div className={style.side_bar_item__name}>
                    {data.name}
                </div>
            }
        </div>
    );
}

export default SideBarItem;
