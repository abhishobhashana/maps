import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export const Loader = () => {
  const mode = UseModeChecker();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <svg
        className="animate-spin-slow"
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 0C13.8954 0 13 0.89543 13 2V8C13 9.10457 13.8954 10 15 10C16.1046 10 17 9.10457 17 8V2C17 0.895431 16.1046 0 15 0ZM25.6066 4.3934C24.8255 3.61235 23.5592 3.61235 22.7782 4.3934L18.5355 8.63604C17.7545 9.41709 17.7545 10.6834 18.5355 11.4645C19.3166 12.2455 20.5829 12.2455 21.364 11.4645L25.6066 7.22183C26.3876 6.44078 26.3876 5.17445 25.6066 4.3934ZM28 13C29.1046 13 30 13.8954 30 15C30 16.1046 29.1046 17 28 17H22C20.8954 17 20 16.1046 20 15C20 13.8954 20.8954 13 22 13H28ZM25.6066 25.6066C26.3876 24.8255 26.3876 23.5592 25.6066 22.7782L21.364 18.5355C20.5829 17.7545 19.3166 17.7545 18.5355 18.5355C17.7545 19.3166 17.7545 20.5829 18.5355 21.364L22.7782 25.6066C23.5592 26.3876 24.8256 26.3876 25.6066 25.6066ZM13 22C13 20.8954 13.8954 20 15 20C16.1046 20 17 20.8954 17 22V28C17 29.1046 16.1046 30 15 30C13.8954 30 13 29.1046 13 28V22ZM11.4645 18.5356C10.6834 17.7545 9.4171 17.7545 8.63605 18.5356L4.39341 22.7782C3.61236 23.5592 3.61236 24.8256 4.39341 25.6066C5.17446 26.3877 6.44079 26.3877 7.22184 25.6066L11.4645 21.364C12.2455 20.5829 12.2455 19.3166 11.4645 18.5356ZM8 13C9.10457 13 10 13.8954 10 15C10 16.1046 9.10457 17 8 17H2C0.89543 17 0 16.1046 0 15C0 13.8954 0.895431 13 2 13H8ZM11.4645 11.4644C12.2455 10.6834 12.2455 9.41707 11.4645 8.63602L7.22184 4.39338C6.44079 3.61233 5.17446 3.61233 4.39341 4.39338C3.61236 5.17443 3.61236 6.44076 4.39341 7.2218L8.63605 11.4644C9.4171 12.2455 10.6834 12.2455 11.4645 11.4644Z"
          fill={mode ? "rgba(235, 235, 245, 0.6)" : "rgba(60, 60, 67, 0.36)"}
        />
      </svg>
    </div>
  );
};
