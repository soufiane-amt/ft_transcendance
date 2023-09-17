"use client"
import React from "react";
import NavBar from './NavBar';
import CreateChannelModule from '../modules/CreateChannel.module.css'

export default function CreateChannel()
{
    return (
        <>
        <NavBar />
        <div className={CreateChannelModule.Create_channel}>
            <div className={CreateChannelModule.aside}>
                <div className={CreateChannelModule.logo_chat}>
                    <img src="../space.png" alt="photo"></img>
                    <p>Chat Space</p>
                </div>
                <div className={CreateChannelModule.aside_bottom}>
                    <div>
                        <img src="../chat-bubble.png"></img>
                        <button>Create Channel</button>
                    </div>
                    {/* <div>
                        <img src="people.png"></img>
                        <button>Search Users</button>
                    </div> */}
                    <div>
                        <img src="../send-message.png"></img>
                        <button>Send Message</button>
                    </div>
                    <div>
                        <img src="../chatroom.png"></img>
                        <button>Chat Room</button>
                    </div>
                </div>
            </div>
            <div className={CreateChannelModule.create_channel}>
                <div className={CreateChannelModule.create_channel_head}>
                    <h3>Create Channel:</h3>
                </div>
                <div className={CreateChannelModule.Create_channel_ctx}>
                    <div className={CreateChannelModule.change_background}>
                        <img src="../v847-te-53a.jpg"></img>
                        <label htmlFor="choose">Choose photo of channel</label>
                        <input type="file" accept="image/*" id="choose" />
                    </div>
                   <div className={CreateChannelModule.create_channel_input}>
                   <div className={CreateChannelModule.create_channel_name}>
                        <label>Channel Name:</label>
                        <input type='text' placeholder="Enter channel name" />
                    </div>
                    <div className={CreateChannelModule.create_channel_type}>
                        <label>Type of Channel:</label>
                        <select>
                            <option>public</option>
                            <option>private</option>
                        </select>
                    </div>
                   </div>
                </div>
                <div className={CreateChannelModule.Add_Users}>
                    <div className={CreateChannelModule.Add_Users_name}>
                        <h3>Add Users:</h3>
                        <div>
                            <img src="../user.jpg"></img>
                            <img src="../user2.jpeg"></img>
                            <img src="../user2.jpeg"></img>
                            <img src="../plus.png" id={CreateChannelModule.plus}></img>
                        </div>
                    </div>
                    <div className={CreateChannelModule.create_channel_btn}>
                        <button>Connect</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}