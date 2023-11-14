import style from '../../../../styles/ChatStyles/WelcomeSection.module.css';


export function WelcomeSection() {
    return (
        <div className={style.welcome_to_chat}>
            <div className={style.welcome_section}>
                <img src={'../../../chatIcons/icons/wave.png'} alt='wave icon'/>
                <h1>Welcome !</h1>
            </div>
            <div className={style.welcome_section_instrucation}>
                <h4>Communicate with your friends</h4>
            </div>
        </div>
    )

}