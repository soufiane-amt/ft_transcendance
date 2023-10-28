'use client'
import { useState } from 'react';
import style from './CreateChannel.module.css';


export function CreateChannel() {

    const [selectedOption, setSelectedOption] = useState("PUBLIC");
    const [newPassword, setNewPassword] = useState('');
    
    const handleSelection = (event: any) => {
        setSelectedOption(event.target.value);
      };
    
    const handlePasswordTyping = (event: any) => {
        setNewPassword(event.target.value);
      };
    
    return (
        <div className={style.create_channel}>
            //upload an image 
            <div className={style.create_channel__image}>
                <input type="image" src="http://upload.wikimedia.org/wikipedia/commons/c/ca/Button-Lightblue.svg" width="30px"/>
                <input type="file" id="my_file"  />
            </div>
            <div className={style.create_channel__title}>
                <span>Create Channel</span>
            </div>
            <div className={style.create_channel__input}>
                <input type="text" placeholder="Channel Name" />
            </div>
            //Select the type of the channel
            <div className={style.create_channel__select}>
                <select
                    value={selectedOption}
                    onChange={handleSelection}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="PROTECTED">Private</option>
                </select>
            </div>
            //GIVE THE CHANNEL A PASSWORD 
            {
                selectedOption === "PROTECTED" &&
                <div className={style.create_channel__input}>
                    <input type="password" placeholder="Password" />
                </div>
            }
            <div className={style.create_channel__button}>
                <button>Create</button>
            </div>
        </div>
    )
}