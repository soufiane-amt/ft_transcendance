import React, { useState } from 'react';
import style from "./CheckBoxList.module.css";
import socket from '../../../socket/socket';

interface CheckboxListProps {
  selectedDiscussion: string;
  confirmSelection: () => void;
  options: (string | undefined)[] | undefined;
}

function CheckboxList({selectedDiscussion, confirmSelection, options }: CheckboxListProps) {
  const [selectedOption, setSelectedOption] = useState('');

  const handleSelect = () => {
    socket.emit('setOwner', {targeted_username: selectedOption, channel_id: selectedDiscussion})
    confirmSelection()
  }
  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={style.checkbox_list}>
      <p>Select your successor:</p>
      <div className={style.users_list}>
      {
        
        options?.map((option, index) => (
          <label key={index}>
            <input
              type="checkbox"
              name="selectedOption"  // Use the same name for all radio buttons to create a radio group
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}

      </div>
      <p>Selected user: {selectedOption}</p>
      {selectedOption && 
      
      <button onClick={handleSelect}>Confirm and Leave</button>
      }
    </div>
  );
}

export default CheckboxList;
