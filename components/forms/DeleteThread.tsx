"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/database/thread/thread.actions";
import { Types } from "mongoose";

type TProps = {
  threadId: Types.ObjectId;
  currentUserId: string;
  authorId: string;
};

function DeleteThread({ threadId, currentUserId, authorId }: TProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delte"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteThread(threadId, pathname);
        // if (!parentId || !isComment) {
        //   router.push("/");
        // }
      }}
    />
  );
}

export default DeleteThread;
