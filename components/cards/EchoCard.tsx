import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import { TUser } from "@/database/user/user.interface";
import { TThreadProfilePage } from "@/database/thread/thread.interface";
import LikeThread from "../forms/LikeThread";
import DeleteEcho from "../forms/DeleteEcho";

type TProps = {
  currentUser_Id: string;
  JSONEcho: string;
  isComment?: boolean;
};

const EchoCard = ({ currentUser_Id, JSONEcho, isComment }: TProps) => {
  const echo = JSON.parse(JSONEcho) as TThreadProfilePage;
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
              href={`/profile/${echo.author._id}`}
              className="relative size-11 max-sm:size-9"
            >
              <Image
                src={echo.author.image!}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="echo-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${echo.author._id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {echo.author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{echo.text}</p>
            <div
              className={`${
                isComment && "mb-10"
              } mt-5 max-sm:mt-3 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <LikeThread
                  thread_Id={`${echo._id}`}
                  likedBy_Id={currentUser_Id}
                  isLiked={echo.likes.includes(currentUser_Id)}
                  likesCount={echo.likes.length}
                />
                <Link href={`/echo/${echo._id}`}>
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
              {isComment && echo.replies.length > 0 && (
                <Link href={`/echo/${echo._id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {echo.replies.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteEcho
          author_Id={`${echo.author?._id}` || null}
          currentUser_Id={currentUser_Id} // json.stringify version
          thread_Id={`${echo._id}`} // json.stringify version
        />
      </div>

      {!isComment && echo.replies.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {echo.replies.slice(0, 2).map((comment, index: number) => (
            <Image
              key={index}
              src={(comment.author as unknown as TUser).image!}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/echo/${echo._id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {echo.replies.length} repl
              {echo.replies.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && echo.community && (
        <Link
          href={`/communities/${echo.community._id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(echo.createdAt)} - {echo.community.name} Community
          </p>
          <Image
            src={echo.community.image!}
            alt={echo.community.name!}
            height={14}
            width={14}
            className="ml-1 rounded-full size-[14px] object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default EchoCard;
