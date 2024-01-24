"use client";

import { handleLikeTherad } from "@/database/thread/thread.actions";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

type TProps = {
  thread_Id: string; // _id
  likedBy_Id: string; // _id
  isLiked: boolean; // _id
};

const LikeThread = ({ thread_Id, likedBy_Id, isLiked }: TProps) => {
  if (!likedBy_Id) redirect("/sign-in");

  const pathname = usePathname();

  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(isLiked);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    setLiked((prev) => !prev);

    try {
      const result = await handleLikeTherad(thread_Id, likedBy_Id, pathname);
      if (typeof result === "boolean") {
        setLiked(result);
      }
    } finally {
      setLiking(false);
    }
  };
  return (
    <>
      <Image
        src={`/assets/heart-${liked ? "filled" : "gray"}.svg`}
        alt="heart"
        width={24}
        height={24}
        className={`cursor-pointer object-contain ${liking && "animate-pulse"}`}
        onClick={handleLike}
      />
    </>
  );
};

export default LikeThread;
