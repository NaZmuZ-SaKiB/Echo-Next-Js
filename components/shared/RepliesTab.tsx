import { fetchUsersReplies } from "@/database/thread/thread.actions";
import ThreadCard from "../cards/ThreadCard";
import Link from "next/link";
import { Types } from "mongoose";

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
            href={`/thread/${reply.parentId._id}`}
            className="w-[70%] h-32 overflow-hidden opacity-40 z-0"
            key={reply.parentId._id}
          >
            <ThreadCard
              threadId={reply.parentId._id}
              currentUserId={currentUserId}
              parentId={null}
              content={reply?.parentId.text}
              author={{
                id: reply?.parentId?.author.id,
                name: reply?.parentId?.author.name,
                image: reply?.parentId?.author.image,
              }}
              community={reply?.parentId?.community}
              createdAt={reply?.parentId?.createdAt}
              comments={[]}
              isComment={false}
            />
          </Link>
          <div className="-mt-16 z-10">
            <ThreadCard
              key={reply._id}
              threadId={reply._id}
              currentUserId={currentUserId}
              parentId={JSON.stringify(reply?.parentId._id)}
              content={reply.text}
              author={{
                id: reply.author.id,
                name: reply.author.name,
                image: reply.author.image,
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
