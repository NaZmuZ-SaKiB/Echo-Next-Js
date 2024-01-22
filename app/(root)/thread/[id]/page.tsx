import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/database/user/user.actions";
import { fetchThreadById } from "@/database/thread/thread.actions";
import Comment from "@/components/forms/Comment";

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
          parentId={JSON.stringify(thread?.parentId)}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
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
        {thread.replies.map((reply: any) => (
          <ThreadCard
            key={reply._id}
            threadId={reply._id}
            currentUserId={user?.id || ""}
            parentId={JSON.stringify(reply?.parentId)}
            content={reply.text}
            author={reply.author}
            community={reply.community}
            createdAt={reply.createdAt}
            comments={reply.replies}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadPage;
