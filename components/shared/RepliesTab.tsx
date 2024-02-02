import ThreadCard from "../cards/ThreadCard";
import Link from "next/link";
import { fetchUsersReplies } from "@/database/user/user.actions";

type TProps = {
  currentUser_Id: string; // _id
  user_id: string; // _id
};

const RepliesTab = async ({ user_id, currentUser_Id }: TProps) => {
  const result = await fetchUsersReplies(user_id);

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {result.map((reply: any) => (
        <div key={reply.parentThread._id.toString()}>
          <Link
            href={`/thread/${reply.parentThread._id}`}
            className="w-[70%] h-32 overflow-hidden opacity-40 z-0"
          >
            <ThreadCard
              thread_Id={reply.parentThread._id.toString()}
              currentUser_Id={currentUser_Id.toString()}
              parent_Id={null}
              content={reply?.parentThread.text}
              author={{
                _id: undefined,
                id: reply?.parentThread?.author.id,
                name: reply?.parentThread?.author.name,
                image: reply?.parentThread?.author.image,
                username: reply?.parentThread?.author.username,
              }}
              community={reply?.parentThread?.community}
              createdAt={reply?.parentThread?.createdAt}
              comments={[]}
              likes={[]}
              isComment={false}
            />
          </Link>
          <div className="-mt-16 z-10">
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
        </div>
      ))}
    </section>
  );
};

export default RepliesTab;
