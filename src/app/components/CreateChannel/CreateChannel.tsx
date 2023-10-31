'use client'
import { useRef, useState } from 'react';
import style from './CreateChannel.module.css';
import UploadChannelIcon from '../../../../public/images/icons/CreateChannel/UploadChannelIcon.jpg'
import { ChannelInvitor } from './ChannelInvitor/ChannelInvitor';
import socket from '../../socket/socket';
import { read } from 'fs';


const MaxChannelNameLength = 15;
const MinChannelNameLength = 3;
const MaxPasswordLength = 50;
const MinPasswordLength = 8;


export function CreateChannel() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [channelName, setChannelName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [channelType, setChannelType] = useState("PUBLIC");
    const [displayChannelInvitor, setDisplayChannelInvitor] = useState <boolean> (false)
    const [selectedImage, setSelectedImage] = useState<{content : string | ArrayBuffer | null, extension: string}>({content :  UploadChannelIcon.src,
                                                             extension :'jpg'});

    const handleSubmitData = (invitedUsers: string[]) => {
        socket.emit('uploadImage', selectedImage); // Send the image data to the server
        socket.emit('createChannel', {channelName,
                                        channelType,
                                        selectedImage,
                                        password,
                                        invitedUsers
                                    });
    }
    const handleImageChange = (event:any) => {
      const file = event.target.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            const imageExtension = file.name.split('.').pop();
            console.log('imageExtension:',imageExtension);
            setSelectedImage({content: reader.result, extension:imageExtension});
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
        setChannelType(event.target.value);
    };
    
    const handleClickUpload  = () => {
        fileInputRef.current!.click();
    }
    
    const handleInviteUsersModal = ()=>{
        //Check if channel name and password and image are valid 

        if (channelName.length < MinChannelNameLength) {
            alert(`Your channel name must be at least ${MinChannelNameLength} characters long!`);
            return;
        }
        if (channelType === "PROTECTED" && password.length < MinPasswordLength) {
            alert(`Your password must be at least ${MinPasswordLength} characters long!`);
            return;
        }
        if (selectedImage.content === UploadChannelIcon.src) {
            alert(`Please choose a picture for the channel!`);
            return;
        }
        setDisplayChannelInvitor(!displayChannelInvitor)
    }
    return (
        <div className={style.create_channel}>
            <h3>Create Channel :</h3>
            <div className={style.create_channel__image}>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}} width="30px" height="30px"/>
                {selectedImage && <img  onClick={handleClickUpload} src={selectedImage.content?.toString()} alt="Selected" style={{ maxWidth: '100%', maxHeight: '300px' }} />}

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
                    value={channelType}
                    onChange={handleSelection}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="PROTECTED">Protected</option>
                </select>
            </div>
            {
                channelType === "PROTECTED" && (
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
                    <ChannelInvitor handleVisibility={handleInviteUsersModal} />
                )
            }
        </div>
    )
}