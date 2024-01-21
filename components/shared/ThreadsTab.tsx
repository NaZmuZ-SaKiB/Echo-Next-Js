import {
  fetchUserThreads,
  getUserActivity,
} from "@/database/user/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/database/community/community.actions";

type TThreadsTabProps = {
  currentUserId: string;
  accountId: string;
  accountType: "User" | "Community" | "Replies";
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
  } else if (accountType === "User") {
    result = await fetchUserThreads(accountId);
    if (!result) return redirect("/");
  } else {
    result = await getUserActivity(accountId);
  }

  const threadsAuthor = {
    name: result?.name,
    image: result?.image,
    id: result?.id,
  };

  return (
    <section className="mt-9 flex flex-col gap-10">
      {(result?.threads || result).map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={JSON.stringify(thread?.parentId)}
          content={thread.text}
          author={
            accountType === "User"
              ? threadsAuthor
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={false}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
