'use client'
import { useRef, useState } from 'react';
import style from './CreateChannel.module.css';
import UploadChannelIcon from '../../../../public/images/icons/CreateChannel/UploadChannelIcon.jpg'
import { ChannelInvitor } from './ChannelInvitor/ChannelInvitor';

export function CreateChannel() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedOption, setSelectedOption] = useState("PUBLIC");
    const [newPassword, setNewPassword] = useState('');
    const [displayChannelInvitor, setDisplayChannelInvitor] = useState <boolean> (false)
    const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };
    
    const handlePasswordTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    const handleClickUpload  = () => {
        fileInputRef.current!.click();
    }
    
    const handleInviteUsersModal = ()=>{
        setDisplayChannelInvitor(!displayChannelInvitor)
    }
    return (
        <div className={style.create_channel}>
            <h3>Create Channel :</h3>
            <div className={style.create_channel__image}>
                <input onClick={handleClickUpload} type="image" src={UploadChannelIcon.src} width="30px"/>
                <input ref={fileInputRef} type="file" style={{display:'none'}}  />
                <label >Choose a picture to the channel</label>
            </div>
            <div className={style.create_channel__name}>
                <label>Channel name :</label>
                <input type="text"  placeholder='Type in the channel name ...' />
            </div>
            <div className={style.create_channel__select}>
                <label>Choose the type of the channel :</label>
                <select
                    value={selectedOption}
                    onChange={handleSelection}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="PROTECTED">Protected</option>
                </select>
            </div>
            {
                selectedOption === "PROTECTED" && (
                <>
                    <label>Channel password :</label>
                    <div className={style.create_channel__password}>
                        <input type="password" placeholder="Password" />
                    </div>
                </>
                )
            }

            <div className={style.create_channel__button}>
                <button onClick={handleInviteUsersModal}>Add Members And Create Channel</button>
            </div>
            {
                displayChannelInvitor && (
                    <ChannelInvitor handleVisibility={handleInviteUsersModal}/>
                )
            }
        </div>
    )
}