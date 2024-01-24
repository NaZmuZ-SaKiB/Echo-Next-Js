import ThreadCard from "@/components/cards/ThreadCard";
import { TCommunity } from "@/database/community/community.interface";
import { fetchThreads } from "@/database/thread/thread.actions";
import { fetchUser } from "@/database/user/user.actions";
import { TUser } from "@/database/user/user.interface";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const result = await fetchThreads(1, 30);
  const user = await currentUser();

  let userInfo: any;
  if (user) {
    userInfo = await fetchUser(user?.id);
  }

  return (
    <main>
      <h1 className="head-text">Home</h1>
      <section className="mt-9 max-sm:mt-4 flex flex-col gap-10 max-sm:gap-4">
        {result?.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.threads.map((thread) => (
              <ThreadCard
                key={thread._id.toString()}
                thread_Id={thread._id.toString()}
                currentUser_Id={userInfo?._id.toString() || ""}
                parent_Id={null}
                content={thread.text}
                author={thread.author as unknown as TUser}
                community={thread.community as unknown as TCommunity}
                createdAt={thread.createdAt!}
                comments={thread.replies}
                likes={thread.likes}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
