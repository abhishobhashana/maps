import React from "react";
import { AppIcon } from "../assets/images/AppIcon";
import Poster from "../assets/images/poster.png";

export default function Contact() {
  return (
    <div className="h-screen max-w-8xl lg:mt-16 md:mt-24 sm:mt-20 mx-auto px-20 sm:px-6 md:px-8">
      <div className="flex flex-col justify-center bg-default-bg-menu text-default-text rounded-lg p-6">
        <AppIcon height="3rem" width="3rem" />
        <h1 className="text-default-text text-3xl">av</h1>
        <span>c</span>
        <img src={Poster} />
      </div>
    </div>
  );
}
