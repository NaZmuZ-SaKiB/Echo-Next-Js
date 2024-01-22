import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/database/community/community.actions";
import { Types } from "mongoose";
import { fetchUserThreads } from "@/database/user/user.actions";

type TThreadsTabProps = {
  currentUserId: string;
  accountId: Types.ObjectId;
  accountType: "User" | "Community";
};

const ThreadsTab = async ({
  accountId,
  accountType,
  currentUserId,
}: TThreadsTabProps) => {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
    if (!result) return redirect("/");
  } else {
    result = await fetchUserThreads(accountId);
    if (!result) return redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          threadId={thread._id}
          currentUserId={currentUserId}
          parentId={thread?.parentThread}
          content={thread.text}
          author={{
            name: thread.author.name,
            image: thread.author.image,
            id: thread.author.id,
            username: thread.author.username,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.replies}
          isComment={false}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
