'use client'

import React, { useState } from "react";
import style from "../../../../styles/ChatStyles/RadioOptions.module.css";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";

interface RadioOptionsProps {
  handleButtonToggle: (op:number)=> void,
  setShowRadioOptions: React.Dispatch<React.SetStateAction<boolean>>;
  selectType: string;
}

export function RadioOptions({handleButtonToggle, setShowRadioOptions, selectType }: RadioOptionsProps) {
    const [selectedOption, setSelectedOption] = useState("1");
    const ref = useOutsideClick(() => setShowRadioOptions(false));
  
    const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      if (selectedOption !== null) {
        console.log("Selected Option:", selectedOption);
      }
      setShowRadioOptions(false);
      handleButtonToggle(parseInt(selectedOption))
    };
  
    const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      setShowRadioOptions(false);
      setSelectedOption('1');
    };
  
    const handleRadioChange = (event: any) => {
      setSelectedOption(event.target.value);
    };
  
    return (
      <div ref={ref} data-inside-modal>
          <div className={style.radio_modal} data-inside-modal>
            <h3 >how long do you want to {selectType} this user :</h3>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="1"
                checked={selectedOption === "1"}
                onChange={handleRadioChange}
                data-inside-modal // Add data-inside-modal here
              />
              1 minute
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="5"
                checked={selectedOption === "5"}
                onChange={handleRadioChange}
                data-inside-modal // Add data-inside-modal here
              />
              5  minutes
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="15"
                checked={selectedOption === "15"}
                onChange={handleRadioChange}
                data-inside-modal 
              />
              15  minutes
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="60"
                checked={selectedOption === "60"}
                onChange={handleRadioChange}
                data-inside-modal 
              />
              1 hour
            </label>
            <div className={style.radio_buttons}>
              <button data-inside-modal onClick={handleConfirmClick}>Confirm</button>
              <button data-inside-modal onClick={handleCancelClick}>Cancel</button>
            </div>
          </div>
      </div>
    );
  }
  