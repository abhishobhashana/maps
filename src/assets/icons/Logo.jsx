import React from "react";
import { UseModeChecker } from "../../useModeChecker";

export default function Logo({ height, width }) {
  const mode = UseModeChecker();

  return (
    <svg
      width={width ? width : "25"}
      height={height ? height : "24"}
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.050415 21.3296C0.050415 22.185 0.542603 22.6772 1.38636 22.6772C1.69104 22.6772 1.98401 22.5835 2.37073 22.3725L7.2926 19.7124V0.294434C7.08167 0.399903 6.84729 0.51709 6.63635 0.634277L1.08167 3.82177C0.37854 4.2085 0.050415 4.77099 0.050415 5.55615V21.3296ZM8.89808 19.4897L14.8043 22.8061C14.9801 22.8999 15.1676 22.9819 15.3434 23.0288V3.9038L9.55433 0.364746C9.35511 0.23584 9.12072 0.14209 8.89808 0.0952148V19.4897ZM16.9371 22.9936C17.0543 22.9585 17.1832 22.9116 17.2887 22.8413L23.3942 19.3725C24.0973 18.9858 24.4254 18.4233 24.4254 17.6382V1.85302C24.4254 0.98584 23.9332 0.505371 23.0895 0.505371C22.7848 0.505371 22.4918 0.599121 22.1051 0.810059L16.9371 3.68115V22.9936Z"
        fill={mode ? "rgb(168, 168, 174)" : "rgba(60, 60, 67, 0.60)"}
      />
    </svg>
  );
}
