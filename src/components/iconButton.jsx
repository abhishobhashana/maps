import React from "react";

const IconButton = ({ className, small, disableVal, icon, onClick }) => {
  return (
    <button
      className={`${className ? className : ""} ${
        disableVal ? "pointer-events-none opacity-50" : ""
      } ${small ? "p-2.5" : "p-3.5"}`}
      onClick={onClick}
    >
      <span
        className={`flex h-5 ${
          small ? "w-auto" : "w-5"
        } items-center justify-center`}
      >
        {icon}
      </span>
    </button>
  );
};

export default IconButton;
