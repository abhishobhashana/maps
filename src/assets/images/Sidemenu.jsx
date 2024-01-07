import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export const Sidemenu = () => {
  const mode = UseModeChecker();
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 28 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.72583 21.7251H23.9992C26.4602 21.7251 27.6789 20.5063 27.6789 18.0922V3.78369C27.6789 1.36963 26.4602 0.150879 23.9992 0.150879H3.72583C1.27661 0.150879 0.0461426 1.35791 0.0461426 3.78369V18.0922C0.0461426 20.518 1.27661 21.7251 3.72583 21.7251ZM3.74926 19.8383C2.57739 19.8383 1.93286 19.2172 1.93286 17.9985V3.87744C1.93286 2.65869 2.57739 2.0376 3.74926 2.0376H23.9758C25.1359 2.0376 25.7922 2.65869 25.7922 3.87744V17.9985C25.7922 19.2172 25.1359 19.8383 23.9758 19.8383H3.74926ZM8.97583 20.2016H10.8156V1.68603H8.97583V20.2016ZM6.72583 6.38525C7.07739 6.38525 7.3938 6.06885 7.3938 5.729C7.3938 5.37744 7.07739 5.07275 6.72583 5.07275H4.2063C3.85473 5.07275 3.55005 5.37744 3.55005 5.729C3.55005 6.06885 3.85473 6.38525 4.2063 6.38525H6.72583ZM6.72583 9.42041C7.07739 9.42041 7.3938 9.104 7.3938 8.75244C7.3938 8.40088 7.07739 8.10791 6.72583 8.10791H4.2063C3.85473 8.10791 3.55005 8.40088 3.55005 8.75244C3.55005 9.104 3.85473 9.42041 4.2063 9.42041H6.72583ZM6.72583 12.4438C7.07739 12.4438 7.3938 12.1508 7.3938 11.7993C7.3938 11.4477 7.07739 11.143 6.72583 11.143H4.2063C3.85473 11.143 3.55005 11.4477 3.55005 11.7993C3.55005 12.1508 3.85473 12.4438 4.2063 12.4438H6.72583Z"
        fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(44, 44, 46, 1)"}
      />
    </svg>
  );
}
