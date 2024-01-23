"use client";

import Image from "next/image";
import { useState } from "react";

type TProps = {
  thread_Id: string; // _id
  likedBy_Id: string; // _id
};

const LikeThread = ({ thread_Id, likedBy_Id }: TProps) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    setLiked((prev) => {
      return !prev;
    });
  };
  return (
    <>
      <Image
        src={`/assets/heart-${liked ? "filled" : "gray"}.svg`}
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
        onClick={handleLike}
      />
    </>
  );
};

export default LikeThread;
