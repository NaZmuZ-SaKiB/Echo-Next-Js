import ThreadCard from "@/components/cards/ThreadCard";
import { TCommunity } from "@/database/community/community.interface";
import { fetchThreads } from "@/database/thread/thread.actions";
import { TUser } from "@/database/user/user.interface";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const user = await currentUser();
  const result = await fetchThreads(1, 30);
  console.log(result);

  return (
    <main>
      <h1 className="head-text">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.threads.map((thread) => (
              <ThreadCard
                key={thread._id.toString()}
                threadId={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread?.parentThread}
                content={thread.text}
                author={thread.author as unknown as TUser}
                community={thread.community as unknown as TCommunity}
                createdAt={thread.createdAt!}
                comments={thread.replies}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
