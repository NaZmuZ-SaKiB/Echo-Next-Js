import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";
import { TUser } from "@/database/user/user.interface";
import { TCommunity } from "@/database/community/community.interface";
import { TThread } from "@/database/thread/thread.interface";
import LikeThread from "../forms/LikeThread";

type TProps = {
  thread_Id: string; // _id
  currentUser_Id: string; // _id
  parent_Id: string | null | undefined; // _id
  content: string;
  author: TUser;
  community: TCommunity;
  createdAt: string;
  comments: TThread[];
  likes: string[];
  isComment?: boolean;
};

const ThreadCard = ({
  thread_Id,
  currentUser_Id,
  parent_Id,
  content,
  author,
  community,
  createdAt,
  comments,
  likes,
  isComment,
}: TProps) => {
  return (
    <article
      className={`
    flex w-full flex-col rounded-xl
    ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"}
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image!}
                alt="Profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <LikeThread
                  thread_Id={thread_Id}
                  likedBy_Id={currentUser_Id}
                  isLiked={likes.includes(currentUser_Id)}
                  likesCount={likes.length}
                />
                <Link href={`/thread/${thread_Id}`}>
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
              {isComment && comments.length > 0 && (
                <Link href={`/thread/${thread_Id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        <DeleteThread
          author_Id={author?._id?.toString() || null}
          currentUser_Id={currentUser_Id} // json.stringify version
          thread_Id={thread_Id} // json.stringify version
        />
      </div>

      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index: number) => (
            <Image
              key={index}
              src={(comment.author as unknown as TUser).image!}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${thread_Id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>
          <Image
            src={community.image!}
            alt={community.name!}
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
