import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

type TThreadsTabProps = {
  currentUserId: string;
  accountId: string;
  accountType: string;
};

const ThreadsTab = async ({
  accountId,
  accountType,
  currentUserId,
}: TThreadsTabProps) => {
  let result = await fetchUserPosts(accountId);
  if (!result) return redirect("/");

  const threadsAuthor = {
    name: result?.name,
    image: result?.image,
    id: result?.id,
  };

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result?.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread?.parentId}
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
          isComment={true}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
