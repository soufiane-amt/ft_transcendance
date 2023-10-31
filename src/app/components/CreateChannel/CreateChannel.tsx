'use client'
import { useRef, useState } from 'react';
import style from './CreateChannel.module.css';
import UploadChannelIcon from '../../../../public/images/icons/CreateChannel/UploadChannelIcon.jpg'
import { ChannelInvitor } from './ChannelInvitor/ChannelInvitor';
import { stringifyCookie } from 'next/dist/compiled/@edge-runtime/cookies';


const MaxChannelNameLength = 15;
const MinChannelNameLength = 3;
const MaxPasswordLength = 50;
const MinPasswordLength = 8;

export function CreateChannel() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [channelName, setChannelName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState("PUBLIC");
    const [displayChannelInvitor, setDisplayChannelInvitor] = useState <boolean> (false)
    const [selectedImage, setSelectedImage] = useState<string | ArrayBuffer | null>(UploadChannelIcon.src);

    const handleImageChange = (event:any) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setSelectedImage(selectedImage);
      }
    };
  
    const handleChannelNameChange = (e :React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        if ( inputText.length <= MaxChannelNameLength &&
            inputText[inputText.length - 1] !== ' ') {
            setChannelName(inputText);
        }
      };
    
      const handlePasswordChange = (e :React.ChangeEvent<HTMLInputElement>) => {
        const inputText = e.target.value;
        if ( inputText.length <= MaxPasswordLength &&
            inputText[inputText.length - 1] !== ' ') {
            setPassword(inputText);
        }
      };
    
    const handleSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(event.target.value);
    };
    
    const handlePasswordTyping = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
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
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}} width="30px" height="30px"/>
                {selectedImage && <img  onClick={handleClickUpload} src={selectedImage.toString()} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />}

                <label >Choose a picture to the channel</label>
            </div>
            <div className={style.create_channel__name}>
                <label>Channel name :</label>
                <input value={channelName} type="text" onChange={handleChannelNameChange} placeholder='Type in the channel name ...' maxLength={MaxChannelNameLength}/>
                {
                    channelName && channelName.length < MinChannelNameLength &&
                    <p className={style.create_channel_warning_message}>
                        Your channel name must be at least {MinChannelNameLength} characters long!
                    </p>

                }
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
                        <input type="password" placeholder="Password" 
                            value={password}
                            onChange={handlePasswordChange}/>
                        {
                         password && password.length < MinPasswordLength &&
                        <p className={style.create_channel_warning_message}>
                            Your password must be at least {MinPasswordLength} characters long!
                        </p>

                        }
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