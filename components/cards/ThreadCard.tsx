import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";
import { TUser } from "@/database/user/user.interface";
import { TThreadProfilePage } from "@/database/thread/thread.interface";
import LikeThread from "../forms/LikeThread";

type TProps = {
  currentUser_Id: string; // _id

  JSONThread: string;

  isComment?: boolean;
};

const ThreadCard = ({ currentUser_Id, JSONThread, isComment }: TProps) => {
  const thread = JSON.parse(JSONThread) as TThreadProfilePage;
  return (
    <article
      className={`
        flex w-full flex-col rounded-xl
        ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 max-sm:p-3"}
        `}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4 max-sm:gap-3">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${thread.author._id}`}
              className="relative size-11 max-sm:size-9"
            >
              <Image
                src={thread.author.image!}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${thread.author._id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {thread.author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">
              {thread.text}
            </p>
            <div
              className={`${
                isComment && "mb-10"
              } mt-5 max-sm:mt-3 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <LikeThread
                  thread_Id={`${thread._id}`}
                  likedBy_Id={currentUser_Id}
                  isLiked={thread.likes.includes(currentUser_Id)}
                  likesCount={thread.likes.length}
                />
                <Link href={`/echo/${thread._id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="heart"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {isComment && thread.replies.length > 0 && (
                <Link href={`/echo/${thread._id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {thread.replies.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          author_Id={`${thread.author?._id}` || null}
          currentUser_Id={currentUser_Id} // json.stringify version
          thread_Id={`${thread._id}`} // json.stringify version
        />
      </div>

      {!isComment && thread.replies.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {thread.replies.slice(0, 2).map((comment, index: number) => (
            <Image
              key={index}
              src={(comment.author as unknown as TUser).image!}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/echo/${thread._id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {thread.replies.length} repl
              {thread.replies.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && thread.community && (
        <Link
          href={`/communities/${thread.community._id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(thread.createdAt)} - {thread.community.name}{" "}
            Community
          </p>
          <Image
            src={thread.community.image!}
            alt={thread.community.name!}
            height={14}
            width={14}
            className="ml-1 rounded-full size-[14px] object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
