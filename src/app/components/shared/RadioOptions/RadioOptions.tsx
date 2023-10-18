import React, { useState } from "react";
import style from "./RadioOptions.module.css";
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";

interface RadioOptionsProps {
  handleButtonToggle: ()=> void,
  setShowRadioOptions: React.Dispatch<React.SetStateAction<boolean>>;
  selectType: string;
}

export function RadioOptions({handleButtonToggle, setShowRadioOptions, selectType }: RadioOptionsProps) {
    const [selectedOption, setSelectedOption] = useState("1 minute");
    const ref = useOutsideClick(() => setShowRadioOptions(false));
  
    const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      if (selectedOption !== null) {
        console.log("Selected Option:", selectedOption);
      }
      setShowRadioOptions(false);
      handleButtonToggle()
    };
  
    const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();//the modal reappears because of event propogation to the parent  
      setShowRadioOptions(false);
      setSelectedOption("1 minute");
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
                value="1 minute"
                checked={selectedOption === "1 minute"}
                onChange={handleRadioChange}
                data-inside-modal // Add data-inside-modal here
              />
              1 minute
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="5  minutes"
                checked={selectedOption === "5  minutes"}
                onChange={handleRadioChange}
                data-inside-modal // Add data-inside-modal here
              />
              5  minutes
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="15  minutes"
                checked={selectedOption === "15  minutes"}
                onChange={handleRadioChange}
                data-inside-modal 
              />
              15  minutes
            </label>
            <label data-inside-modal className={style.radio_option}>
              <input
                type="radio"
                value="1 hour"
                checked={selectedOption === "1 hour"}
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
  