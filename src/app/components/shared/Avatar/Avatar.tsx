import React from 'react';
import style from './Avatar.module.css'; // Import your CSS styles
import Image from 'next/image';

interface AvatarProps {
  src: string;
  avatarToRight : boolean;
  status?: 'online' | 'offline'; // Optional status prop for user avatars
  channelType?: 'public' | 'private' | 'announcement'; // Type prop to specify channel type
}

const Avatar: React.FC<AvatarProps> = ({ src, avatarToRight,status, channelType }) => {
  const avatarStylingClasses: string = `${style.avatar__style} ${
    avatarToRight ? style.image__switch_order : ""
  } `;

  return (
    <div className={avatarStylingClasses}>
        <Image
          className={`${style.avatar__dimentions} ${style.image__full_circle}`}
          src={src}
          alt="user avatar"
          width={100}
          height={1000}
        />
      {status === 'online' && (
        <div className={`${style.statusIndicator}`} />
      )}
      {status === 'offline' && (
        <div className={`${style.statusIndicator} ${style.offline}`} />
      )}
      {channelType && (
        <div className={style.channelTypeIndicator}>
          {/* Render channel type icon or indicator */}
          {channelType === 'public' ? '🌐' : channelType === 'private' ? '🔒' : '🔑'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
