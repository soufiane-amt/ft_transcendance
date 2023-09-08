import Image from "next/image";
import style from "./Avatar.module.css";


function Avatar({ messageOwnerAvatar, avatarToRight }) {
    const avatarStylingClasses: string = `${style.avatar__style} ${
      avatarToRight ? style.image__switch_order : ""
    } `;
    return (
      <div className={avatarStylingClasses}>
        <Image
          className={`${style.avatar__dimentions} ${style.image__full_circle}`}
          src={messageOwnerAvatar}
          alt="user avatar"
          width={100}
          height={1000}
        />
      </div>
    );
  }

export default Avatar;