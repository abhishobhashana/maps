import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export default function CloseCircle() {
  const mode = UseModeChecker();

  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_2207_22886)">
        <path
          d="M12.0434 24.0058C18.5825 24.0058 23.9965 18.5801 23.9965 12.0527C23.9965 5.51367 18.5708 0.0996094 12.0317 0.0996094C5.50439 0.0996094 0.090332 5.51367 0.090332 12.0527C0.090332 18.5801 5.51611 24.0058 12.0434 24.0058Z"
          fill={mode ? "#414141" : "rgba(118, 118, 128, 0.12)"}
        />
        <path
          d="M8.10595 16.9746C7.56689 16.9746 7.14502 16.541 7.14502 16.0019C7.14502 15.7441 7.23877 15.498 7.42627 15.3223L10.6723 12.0644L7.42627 8.81836C7.23877 8.63086 7.14502 8.39649 7.14502 8.13867C7.14502 7.58789 7.56689 7.17773 8.10595 7.17773C8.37549 7.17773 8.58642 7.27149 8.77392 7.44727L12.0434 10.7051L15.3364 7.43555C15.5356 7.23633 15.7465 7.1543 16.0044 7.1543C16.5434 7.1543 16.977 7.57617 16.977 8.11523C16.977 8.38477 16.895 8.5957 16.6841 8.80664L13.4262 12.0644L16.6723 15.3105C16.8715 15.4863 16.9653 15.7324 16.9653 16.0019C16.9653 16.541 16.5317 16.9746 15.9809 16.9746C15.7114 16.9746 15.4653 16.8808 15.2895 16.6934L12.0434 13.4355L8.80908 16.6934C8.62158 16.8808 8.37549 16.9746 8.10595 16.9746Z"
          fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(60, 60, 67, 0.60)"}
        />
      </g>
      <defs>
        <clipPath id="clip0_2207_22886">
          <rect
            width="23.9062"
            height="23.918"
            fill="white"
            transform="translate(0.090332 0.0996094)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};