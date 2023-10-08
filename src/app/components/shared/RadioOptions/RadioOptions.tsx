import React, { useState } from "react";
import style from "./RadioOptions.module.css"
import { useOutsideClick } from "../../../../../hooks/useOutsideClick";


interface RadioOptionsProps {
    showOptionsState: {
        showRadioOptions : boolean, 
        setShowRadioOptions: React.Dispatch<React.SetStateAction<boolean>>;
    } 
        
    selectType : string
}
export function RadioOptions({showOptionsState, selectType}:RadioOptionsProps) {
  const [selectedOption, setSelectedOption] = useState(null);
  const {showRadioOptions, setShowRadioOptions} = showOptionsState
  const ref = useOutsideClick(()=> setShowRadioOptions(false));

  const handleConfirmClick = () => {
    if (selectedOption !== null) {
      // Handle the selected option here (e.g., save it to state or perform an action)
      console.log("Selected Option:", selectedOption);
    }
    setShowRadioOptions(false);
    setSelectedOption(null);
  };

  const handleCancelClick = () => {
    setShowRadioOptions(false);
    setSelectedOption(null);
  };

  const handleRadioChange = (event :any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div ref={ref}>
      {showRadioOptions && (
        <div className={style.radio_modal}>
          <h3>{selectType}  user for :</h3>
          <label className={style.radio_option}>
            <input
              type="radio"
              value="Option 1"
              checked={selectedOption === "Option 1"}
              onChange={handleRadioChange}
            />
            Option 1
          </label>
          <label className={style.radio_option}>
            <input
              type="radio"
              value="Option 2"
              checked={selectedOption === "Option 2"}
              onChange={handleRadioChange}
            />
            Option 2
          </label>
          <label className={style.radio_option}>
            <input
              type="radio"
              value="Option 3"
              checked={selectedOption === "Option 3"}
              onChange={handleRadioChange}
            />
            Option 3
          </label>
        <div className={style.radio_buttons}>
            <button onClick={handleConfirmClick}>Confirm</button>
            <button onClick={handleCancelClick}>Cancel</button>
        </div>
        </div>
        )}
    </div>
  );
}
