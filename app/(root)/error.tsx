"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid place-items-center h-[75vh]">
      <div className="text-light-1 text-center">
        <span className="text-[5rem]">Error</span>
        <h1 className="text-[3rem]">Something went wrong!</h1>
      </div>
    </div>
  );
}
