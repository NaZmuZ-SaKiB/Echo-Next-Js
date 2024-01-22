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
        {result?.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user?.id || ""}
                parentId={JSON.stringify(post?.parentId)}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
