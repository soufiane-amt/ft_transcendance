"use client";

import React, { useState } from "react";
import style from "../../../../styles/ChatStyles/RadioOptions.module.css";
import { useOutsideClick } from "../../../../CustomHooks/useOutsideClick";

interface RadioOptionsProps {
  handleButtonToggle: (op: number) => void;
  setShowRadioOptions: React.Dispatch<React.SetStateAction<boolean>>;
  selectType: string;
}

const Icons = {
  clock: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  close: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  ban: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    </svg>
  ),
  mute: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  ),
};

const durationOptions = [
  { value: 1, label: "1 minute", shortLabel: "1m" },
  { value: 5, label: "5 minutes", shortLabel: "5m" },
  { value: 15, label: "15 minutes", shortLabel: "15m" },
  { value: 60, label: "1 hour", shortLabel: "1h" },
  { value: 1440, label: "24 hours", shortLabel: "24h" },
  { value: -1, label: "Permanent", shortLabel: "∞" },
];

export function RadioOptions({
  handleButtonToggle,
  setShowRadioOptions,
  selectType,
}: RadioOptionsProps) {
  const [selectedOption, setSelectedOption] = useState(1);
  const ref = useOutsideClick(() => setShowRadioOptions(false));

  const handleConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowRadioOptions(false);
    handleButtonToggle(selectedOption);
  };

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowRadioOptions(false);
    setSelectedOption(1);
  };

  const handleOptionSelect = (value: number) => {
    setSelectedOption(value);
  };

  const getActionIcon = () => {
    return selectType.toUpperCase() === "BAN" ? Icons.ban : Icons.mute;
  };

  const getActionColor = () => {
    return selectType.toUpperCase() === "BAN" ? "danger" : "warning";
  };

  return (
    <div
      ref={ref}
      className={style.radio_overlay}
      data-inside-modal
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`${style.radio_modal} ${style[getActionColor()]}`} data-inside-modal>
        {/* Header */}
        <div className={style.modal_header}>
          <div className={`${style.header_icon} ${style[`icon_${getActionColor()}`]}`}>
            {getActionIcon()}
          </div>
          <div className={style.header_text}>
            <h3 className={style.modal_title}>
              {selectType.charAt(0).toUpperCase() + selectType.slice(1).toLowerCase()} Duration
            </h3>
            <p className={style.modal_subtitle}>
              Select how long this action should last
            </p>
          </div>
          <button
            className={style.close_button}
            onClick={handleCancelClick}
            data-inside-modal
          >
            {Icons.close}
          </button>
        </div>

        {/* Duration Options */}
        <div className={style.options_container}>
          <div className={style.options_grid}>
            {durationOptions.map((option) => (
              <button
                key={option.value}
                className={`${style.option_card} ${
                  selectedOption === option.value ? style.option_selected : ""
                } ${option.value === -1 ? style.option_permanent : ""}`}
                onClick={() => handleOptionSelect(option.value)}
                data-inside-modal
              >
                <div className={style.option_icon}>{Icons.clock}</div>
                <span className={style.option_short}>{option.shortLabel}</span>
                <span className={style.option_label}>{option.label}</span>
                {selectedOption === option.value && (
                  <div className={style.option_check}>{Icons.check}</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Summary */}
        <div className={style.summary}>
          <span className={style.summary_label}>Selected duration:</span>
          <span className={`${style.summary_value} ${style[getActionColor()]}`}>
            {durationOptions.find((o) => o.value === selectedOption)?.label}
          </span>
        </div>

        {/* Action Buttons */}
        <div className={style.action_buttons}>
          <button
            className={style.cancel_button}
            onClick={handleCancelClick}
            data-inside-modal
          >
            Cancel
          </button>
          <button
            className={`${style.confirm_button} ${style[`confirm_${getActionColor()}`]}`}
            onClick={handleConfirmClick}
            data-inside-modal
          >
            <span>Confirm {selectType}</span>
            {getActionIcon()}
          </button>
        </div>
      </div>
    </div>
  );
}
