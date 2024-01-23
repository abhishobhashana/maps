import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export const Routes = () => {
  const mode = UseModeChecker();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_2124_13773)">
        <path
          d="M11.9531 23.9062C18.4922 23.9062 23.9062 18.4805 23.9062 11.9531C23.9062 5.41406 18.4805 0 11.9414 0C5.41406 0 0 5.41406 0 11.9531C0 18.4805 5.42578 23.9062 11.9531 23.9062ZM11.9531 21.9141C6.42188 21.9141 2.00391 17.4844 2.00391 11.9531C2.00391 6.42188 6.41016 1.99219 11.9414 1.99219C17.4727 1.99219 21.9141 6.42188 21.9141 11.9531C21.9141 17.4844 17.4844 21.9141 11.9531 21.9141Z"
          fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(60, 60, 67, 0.60)"}
        />
        <path
          d="M6.85547 15.6445C6.85547 16.3125 7.19531 16.7109 7.79297 16.6992C8.39062 16.6875 8.73047 16.3125 8.73047 15.6445V12.3867C8.73047 11.3203 9.24609 10.8281 10.2539 10.8281H13.3125V12.668C13.3125 13.4297 14.168 13.7812 14.8125 13.2305L17.6016 10.8047C18.3047 10.1953 18.3047 9.57419 17.6016 8.96481L14.8125 6.55075C14.168 5.98825 13.3125 6.35153 13.3125 7.10153V8.94138H10.2188C7.94531 8.94138 6.85547 10.0312 6.85547 12.293V15.6445Z"
          fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(60, 60, 67, 0.60)"}
        />
      </g>
      <defs>
        <clipPath id="clip0_2124_13773">
          <rect width="23.9062" height="23.918" fill="white" />
        </clipPath>
      </defs>
    </svg>

    // <svg
    //   width="17"
    //   height="17"
    //   viewBox="0 0 20 20"
    //   fill="none"
    //   xmlns="http://www.w3.org/2000/svg"
    // >
    //   <path
    //     d="M0.389421 15.4146C0.787858 15.8247 1.47926 15.813 1.8777 15.4146L7.8777 9.40285L13.8894 15.4146C14.2879 15.813 14.9676 15.8247 15.366 15.4146C15.7879 15.0044 15.7762 14.3247 15.366 13.9263L9.36598 7.91457L15.366 1.91457C15.7762 1.51613 15.7879 0.824723 15.366 0.426285C14.9676 0.0161292 14.2879 0.027848 13.8894 0.426285L7.8777 6.438L1.8777 0.426285C1.47926 0.027848 0.787858 0.0161292 0.389421 0.426285C-0.0207364 0.824723 -0.00901726 1.51613 0.389421 1.91457L6.40114 7.91457L0.389421 13.9263C-0.00901726 14.3247 -0.0207364 15.0044 0.389421 15.4146Z"
    //     fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(44, 44, 46, 1)"}
    //   />
    // </svg>
  );
};
