"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/database/thread/thread.actions";
import { Types } from "mongoose";

type TProps = {
  thread_Id: string;
  currentUser_Id: string;
  author_Id: string | null;
};

function DeleteThread({ thread_Id, currentUser_Id, author_Id }: TProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUser_Id !== author_Id || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delte"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteThread(JSON.parse(thread_Id), pathname);
        // if (!parentId || !isComment) {
        //   router.push("/");
        // }
      }}
    />
  );
}

export default DeleteThread;
