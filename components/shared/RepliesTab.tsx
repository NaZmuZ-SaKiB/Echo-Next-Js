import ThreadCard from "../cards/ThreadCard";
import Link from "next/link";
import { Types } from "mongoose";
import { fetchUsersReplies } from "@/database/user/user.actions";

type TProps = {
  currentUserId: string;
  user_id: Types.ObjectId;
};

const RepliesTab = async ({ user_id, currentUserId }: TProps) => {
  const result = await fetchUsersReplies(user_id);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.map((reply: any) => (
        <>
          <Link
            href={`/thread/${reply.parentThread._id}`}
            className="w-[70%] h-32 overflow-hidden opacity-40 z-0"
            key={reply.parentThread._id}
          >
            <ThreadCard
              threadId={reply.parentThread._id}
              currentUserId={currentUserId}
              parentId={null}
              content={reply?.parentThread.text}
              author={{
                id: reply?.parentThread?.author.id,
                name: reply?.parentThread?.author.name,
                image: reply?.parentThread?.author.image,
                username: reply?.parentThread?.author.username,
              }}
              community={reply?.parentThread?.community}
              createdAt={reply?.parentThread?.createdAt}
              comments={[]}
              isComment={false}
            />
          </Link>
          <div className="-mt-16 z-10">
            <ThreadCard
              key={reply._id}
              threadId={reply._id}
              currentUserId={currentUserId}
              parentId={reply?.parentThread._id}
              content={reply.text}
              author={{
                id: reply.author.id,
                name: reply.author.name,
                image: reply.author.image,
                username: reply.author.username,
              }}
              community={reply.community}
              createdAt={reply.createdAt}
              comments={reply?.replies}
              isComment={false}
            />
          </div>
        </>
      ))}
    </section>
  );
};

export default RepliesTab;
