import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/database/user/user.actions";
import { fetchThreadById } from "@/database/thread/thread.actions";
import Comment from "@/components/forms/Comment";
import { TUser } from "@/database/user/user.interface";
import { TCommunity } from "@/database/community/community.interface";

const ThreadPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          thread_Id={thread._id.toString()}
          currentUser_Id={userInfo?._id.toString() || ""}
          parent_Id={thread?.parentThread?.toString()}
          content={thread.text}
          author={thread.author as unknown as TUser}
          community={thread.community as unknown as TCommunity}
          createdAt={thread.createdAt as unknown as string}
          comments={thread.replies}
          likes={thread.likes}
        />
      </div>

      <div className="mt-7">
        <Comment
          thread_Id={thread._id.toString()}
          currentUserImg={userInfo.image || user.imageUrl}
          currentUser_Id={userInfo._id.toString()}
        />
      </div>

      <div className="mt-10">
        {thread.replies.map((reply) => (
          <ThreadCard
            key={reply._id.toString()}
            thread_Id={reply._id.toString()}
            currentUser_Id={userInfo?._id.toString() || ""}
            parent_Id={reply?.parentThread?.toString()}
            content={reply.text}
            author={reply.author as unknown as TUser}
            community={reply.community as unknown as TCommunity}
            createdAt={reply.createdAt as unknown as string}
            comments={reply.replies}
            likes={reply.likes}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadPage;
