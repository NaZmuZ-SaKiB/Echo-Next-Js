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
          threadId={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread?.parentThread}
          content={thread.text}
          author={thread.author as unknown as TUser}
          community={thread.community as unknown as TCommunity}
          createdAt={thread.createdAt as unknown as string}
          comments={thread.replies}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={JSON.stringify(thread._id)}
          currentUserImg={userInfo.image || user.imageUrl}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {thread.replies.map((reply) => (
          <ThreadCard
            key={reply._id.toString()}
            threadId={reply._id}
            currentUserId={user?.id || ""}
            parentId={reply?.parentThread}
            content={reply.text}
            author={reply.author as unknown as TUser}
            community={reply.community as unknown as TCommunity}
            createdAt={reply.createdAt as unknown as string}
            comments={reply.replies}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadPage;
