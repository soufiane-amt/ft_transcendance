'use client'
import { useEffect, useRef, useState } from 'react';
import style from '../../../styles/ChatStyles/CreateChannel.module.css';
import UploadChannelIcon from '../../../../public/chatIcons/icons/CreateChannel/UploadChannelIcon.jpg'
import { ChannelInvitor } from './ChannelInvitor/ChannelInvitor';
import socket from '../../../app/socket/socket';
import { fetchDataFromApi } from '../CustomFetch/fetchDataFromApi';
import axios from 'axios';


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
    // const [selectedImage, setSelectedImage] = useState<{content : string | ArrayBuffer | null, extension: string}>({content :  UploadChannelIcon.src,
    //                                      extension :'jpg'});
    const [image, setImage] = useState<FormData | null>(null);

        
        
    const [condidateUsers, setUserCondidates] = useState<Map<string, string>>(new Map<string, string>()); // [username, avatar
    useEffect(() => {
      async function fetchDataAsync() {
        const messagesHistory_tmp = await fetchDataFromApi(
          `http://localhost:3001/chat/memberCondidatesOfChannelCreation`
        );
        const condidateUsers_tmp = new Map<string, string>();
        messagesHistory_tmp?.forEach((user: any) => {
            condidateUsers_tmp.set(user.username, user.avatar);
        });
        setUserCondidates(condidateUsers_tmp);        
      }
      fetchDataAsync();
    }, []);
                                                                  

    //send a post request to the server to get usernames along with their avatars
    const handleSubmitData = async (invitedUsers: string[]) => {
        if (!image) {
          alert('Please choose a picture for the channel!');
          return;
        }
      
        if (channelName.length < MinChannelNameLength) {
          alert(`Your channel name must be at least ${MinChannelNameLength} characters long!`);
          return;
        }
      
        if (channelType === 'PROTECTED' && password.length < MinPasswordLength) {
          alert(`Your password must be at least ${MinPasswordLength} characters long!`);
          return;
        }
        const response = await axios.post('http://localhost:3001/chat/upload', image,{
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
            .then(res => {

              if (res.status === 201 || res.status === 200) {
                // Continue with the rest of your createChannel logic
                socket.emit('createChannel', {
                  channelName,
                  imageSrc: res.data.imageSrc,
                  channelType,
                  password,
                  invitedUsers,
                });
              }
          })
              
              

          };
    
      const handleImageChange = (event:any) => {
        const formData = new FormData(); 
        formData.append('file', event.target.files[0], event.target.files[0].name);
        setImage(formData);    
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
        if (image === null) {
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
                {
                <img  onClick={handleClickUpload}
                src={image ? URL.createObjectURL(image.get('file') as Blob) : UploadChannelIcon.src}
                alt="Selected"
                style={{
                    maxWidth: '100%', maxHeight: '300px' }} />}

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
                    <ChannelInvitor userCondidates={condidateUsers} handleVisibility={handleInviteUsersModal} onConfirm={handleSubmitData} />
                )
            }
        </div>
    )
}