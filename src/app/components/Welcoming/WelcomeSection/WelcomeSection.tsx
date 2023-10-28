import waveIcon from '../../../images/icons/wave.png';
import style from './WelcomeSection.module.css';


export function WelcomeSection() {
    return (
        <div className={style.welcome_to_chat}>
            <div className={style.welcome_section}>
                <img src={'../../../images/icons/wave.png'}></img>
                <h1>Welcome !</h1>
            </div>
            <div className={style.welcome_section_instrucation}>
                <h4>Communicate with your friends</h4>
            </div>
        </div>
    )

}