'use client'

import React from 'react';
import style from '../../../../styles/ChatStyles/Avatar.module.css'; // Import your CSS styles
import Image from 'next/image';

interface AvatarProps {
  src: string;
  avatarToRight : boolean;
  channelType?: string | undefined; // Type prop to specify channel type
}

const Avatar: React.FC<AvatarProps> = ({ src, avatarToRight, channelType }) => {
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
          height={100}
        />
      {channelType && (
        <div className={style.channelTypeIndicator}>
          {channelType === 'PUBLIC' ? '🌐' : channelType === 'PRIVATE' ? '🔒' : '🔑'}
        </div>
      )}
    </div>
  );
};

export default Avatar;
