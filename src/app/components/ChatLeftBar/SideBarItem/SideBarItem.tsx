import style from './SideBarItem.module.css';


interface SideBarItemProps{
    props: {icon: string, name: string}
}

export function SideBarItem ({props}: SideBarItemProps) {
    return (
        <div className={style.side_bar_item}>
            <div className={style.side_bar_item__icon}>
                <img src={props.icon} alt="icon " />
            </div>
            <div className={style.side_bar_item__name}>
                {props.name}
            </div>
        </div>
    )
}