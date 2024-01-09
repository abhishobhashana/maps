import React from "react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-2xl text-secondary dark:text-dark-grey">Oops!</h1>
      <span className="text-secondary dark:text-dark-grey">
        Sorry, an unexpected error has occurred.
      </span>
    </div>
  );
}
