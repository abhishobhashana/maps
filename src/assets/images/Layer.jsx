import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export const Layer = () => {
  const mode = UseModeChecker();

  return (
    <svg
      height="24"
      width="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M17.4 10L21 12L17.4 14M17.4 10L12 13L6.6 10M17.4 10L21 8L12 3L3 8L6.6 10M6.6 10L3 12L6.6 14M17.4 14L21 16L12 21L3 16L6.6 14M17.4 14L12 17L6.6 14"
          stroke={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(44, 44, 46, 1)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
};
