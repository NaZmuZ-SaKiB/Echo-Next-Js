"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteThread } from "@/database/thread/thread.actions";

type TProps = {
  thread_Id: string;
  currentUser_Id: string;
  author_Id: string | null;
};

function DeleteEcho({ thread_Id, currentUser_Id, author_Id }: TProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [deleteStarted, setDeleteStarted] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async () => {
    setDeleteStarted(true);
    try {
      const result = await deleteThread(thread_Id, pathname);
      // if (!parentId || !isComment) {
      //   router.push("/");
      // }
      if (result.success) {
        setDeleted(true);
      }
    } finally {
      setDeleteStarted(false);
    }
  };
  if (currentUser_Id !== author_Id || pathname === "/") return null;

  return (
    <>
      {!deleted &&
        (deleteStarted ? (
          <span className="text-red-500">Deleting...</span>
        ) : (
          <Image
            src="/assets/delete.svg"
            alt="delte"
            width={18}
            height={18}
            className="cursor-pointer object-contain"
            onClick={handleDelete}
          />
        ))}
    </>
  );
}

export default DeleteEcho;
