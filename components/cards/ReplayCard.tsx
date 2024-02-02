import Image from "next/image";
import ThreadCard from "./ThreadCard";
import Link from "next/link";

const ReplayCard = ({
  reply,
  currentUser_Id,
}: {
  reply: any;
  currentUser_Id: string;
}) => {
  return (
    <div>
      <Link
        href={`/thread/${reply?.parentThread?._id}`}
        className={`flex w-full flex-col rounded-xl bg-dark-4 opacity-50 p-5 max-h-20 max-w-[70%] overflow-hidden max-sm:p-3`}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4 max-sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="relative size-11 max-sm:size-9">
                <Image
                  src={reply?.parentThread?.author?.image}
                  alt="Profile image"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="thread-card_bar" />
            </div>

            <div className="flex w-full flex-col">
              <div className="w-fit">
                <h4 className="text-base-semibold text-light-1">
                  {reply?.parentThread?.author?.name}
                </h4>
              </div>
              <p className="mt-2 text-small-regular text-light-2">
                {reply?.parentThread?.text}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <ThreadCard
        key={reply._id.toString()}
        thread_Id={reply._id.toString()}
        currentUser_Id={currentUser_Id.toString()}
        parent_Id={reply?.parentThread._id.toString()}
        content={reply.text}
        author={{
          _id: reply.author._id,
          id: reply.author.id,
          name: reply.author.name,
          image: reply.author.image,
          username: reply.author.username,
        }}
        community={reply.community}
        createdAt={reply.createdAt}
        comments={reply?.replies}
        likes={reply?.likes}
        isComment={false}
      />
    </div>
  );
};

export default ReplayCard;
