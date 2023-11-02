'use client'

import axios from 'axios';
import { ChatLeftBar } from '../components/ChatLeftBar/ChatLeftBar'
import { UserInitiativeTalk } from '../components/Welcoming/UserInitiativeTalk/UserInitiativeTalk'
import { WelcomingPage } from '../components/Welcoming/WelcomingPage'
// import { UserInitiativeTalk } from '../../components/WelcomingPage/UserInitiativeTalk/UserInitiativeTalk.1'
import style from './page.module.css';
import { useState } from 'react';



// export default function page() {
  
//   return (
//     <div className={style.initial_arranging}>
//       <ChatLeftBar/>
//       <WelcomingPage/>
//     </div>
//     )
// }

// import React, { useState } from 'react';

// export function Upload() {
//   const [imageFile, setImageFile] = useState(null);

//   const handleImageUpload = (e:any) => {
//     const file = e.target.files[0];
//     console.log('file:' + file)
//     const formData = new FormData();
//     formData.append('file', file);

//     setImageFile(file);
//   };

//   const handleImageSubmit = async () => {
//     if (imageFile) {
//       const formData = new FormData();
//       formData.append('file', imageFile); // Use the correct field name expected by the server

//       //print all data of formData
//       try
//      {
//         const response = await fetch('http://localhost:3001/chat/upload', {
//           method: 'POST',
//           body: formData,
//           credentials: 'include',
//         });

//         if (response.ok) {
//           console.log('Image uploaded successfully.');
//           // Optionally, you can perform additional actions after a successful upload.
//         } else {
//           console.error('Image upload failed.');
//         }
//       } catch (error) {
//         console.error('Error uploading image:', error);
//       }
//     } else {
//       console.error('No image file selected for upload.');
//     }
//   };

//   const handleSubmit = (e:any) => {
//     e.preventDefault();
//   };

//   return (
//     <div>
//       <h1>Image Upload</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="image/*" onChange={handleImageUpload} />
//         <button type="submit">Upload Image</button>
//       </form>
//       {imageFile && (
//         <div>
//           <h2>Uploaded Image:</h2>
//           <img src={URL.createObjectURL(imageFile)} alt="Uploaded" />
//           <button onClick={handleImageSubmit}>Submit Image</button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Upload;


function Upload() {
  const [image, setImage] = useState<FormData | null>(null);
  const handleClick = () => {
    if (image) {
      axios.post('http://localhost:3001/chat/upload', image,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },}    
      )
      .then(res => {
        console.log('Axios response: ', res)
      })
    } else {
      console.error('No image file selected for upload.');
    }
  }
  const handleFileInput = (e:any) => {
    console.log('handleFileInput working!')
    console.log(e.target.files[0]);
    const formData = new FormData(); 
    formData.append('file', e.target.files[0], e.target.files[0].name);
    setImage(formData);
  }
  return (
    <div className="App">
      <h1>Image Upload Tutorial</h1>
      <button onClick={handleClick}>Upload!</button>
      <input type="file" onChange={handleFileInput}/>
    </div>
  );
}


export default Upload;
