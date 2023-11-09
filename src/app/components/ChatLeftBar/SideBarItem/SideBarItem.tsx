import React from 'react';
import style from './SideBarItem.module.css';

interface SideBarItemProps{
    handleNavigation: () => void,
    data: {icon: string, name: string}
}

function SideBarItem ({handleNavigation, data}: SideBarItemProps) {
    return (
        <div className={style.side_bar_item} onClick={handleNavigation}>
            <div className={style.side_bar_item__icon}>
                <img src={data.icon} alt="icon " />
            </div>
            <div className={style.side_bar_item__name}>
                {data.name}
            </div>
        </div>
    );
}

export default SideBarItem;
