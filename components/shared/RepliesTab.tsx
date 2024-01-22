import { getUserActivity } from "@/database/user/user.actions";
import ThreadCard from "../cards/ThreadCard";
import Link from "next/link";

type TProps = {
  currentUserId: string;
  accountId: string;
};

const RepliesTab = async ({ accountId, currentUserId }: TProps) => {
  const result = await getUserActivity(accountId);

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
              threadId={reply._id}
              currentUserId={currentUserId}
              parentId={JSON.stringify(reply?.parentId._id)}
              content={reply?.parentId.text}
              author={{
                id: reply?.parentId?.author.id,
                name: reply?.parentId?.author.name,
                image: reply?.parentId?.author.image,
              }}
              community={reply?.parentId?.community}
              createdAt={reply?.parentId?.createdAt}
              comments={reply?.parentId?.children}
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
              comments={reply.children}
              isComment={false}
            />
          </div>
        </>
      ))}
    </section>
  );
};

export default RepliesTab;
