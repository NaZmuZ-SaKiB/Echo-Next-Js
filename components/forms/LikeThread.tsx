"use client";

import { handleLikeTherad } from "@/database/thread/thread.actions";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

type TProps = {
  thread_Id: string; // _id
  likedBy_Id: string; // _id
  isLiked: boolean; // _id
  likesCount: number;
};

const LikeThread = ({ thread_Id, likedBy_Id, isLiked, likesCount }: TProps) => {
  if (!likedBy_Id) redirect("/sign-in");

  const pathname = usePathname();

  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [totalLikes, setTotalLikes] = useState(likesCount);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);

    setLiked((prev) => !prev);

    try {
      const result = await handleLikeTherad(thread_Id, likedBy_Id, pathname);
      if (result?.liked !== undefined) {
        setLiked(result.liked);

        if (result.liked) {
          setTotalLikes(likesCount + 1);
        } else setTotalLikes(likesCount - 1);
      }
    } finally {
      setLiking(false);
    }
  };
  return (
    <div className="flex">
      <Image
        src={`/assets/heart-${liked ? "filled" : "gray"}.svg`}
        alt="heart"
        width={24}
        height={24}
        className={`cursor-pointer object-contain ${liking && "animate-ping"}`}
        onClick={handleLike}
      />
      {totalLikes !== 0 && (
        <span className="text-subtle-medium text-gray-1">{totalLikes}</span>
      )}
    </div>
  );
};

export default LikeThread;
