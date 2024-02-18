import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import data from "../data/data.json";
import { Logo } from "../assets/icons";

export default function ErrorPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = data.notFound;
  }, []);

  return (
    <>
      <button
        className="absolute top-0 left-0 m-5"
        onClick={() => {
          navigate("/");
          document.title = data.app;
        }}
      >
        <Logo />
      </button>
      <div className="min-h-screen flex items-center justify-center text-center text-secondary dark:text-dark-grey px-10">
        <h1 className="lg:text-5xl md:text-3xl sm:text-2xl">
          {data.notFoundMessage}
        </h1>
      </div>
    </>
  );
}
