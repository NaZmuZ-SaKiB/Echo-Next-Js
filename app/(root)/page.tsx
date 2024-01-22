import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/database/thread/thread.actions";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const result = await fetchThreads(1, 30);
  const user = await currentUser();
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
                key={thread._id}
                threadId={thread._id}
                currentUserId={user?.id || ""}
                parentId={JSON.stringify(thread?.parentId)}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
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
