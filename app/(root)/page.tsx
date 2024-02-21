import ThreadCard2 from "@/components/cards/ThreadCard2";
import ThreadsInfiniteScroll from "@/components/shared/ThreadsInfiniteScroll";
import { fetchThreads } from "@/database/thread/thread.actions";
import { fetchUser } from "@/database/user/user.actions";
import { currentUser } from "@clerk/nextjs";

const Home = async () => {
  const limit = 4;
  const result = await fetchThreads(1, limit);
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
              <ThreadCard2
                key={`${thread._id}`}
                currentUser_Id={`${userInfo?._id}` || ""}
                JSONThread={JSON.stringify(thread)}
              />
            ))}
            <ThreadsInfiniteScroll
              limit={limit}
              user_Id={`${userInfo?._id}`}
              fetchFunc={fetchThreads}
              args={[]}
            />
          </>
        )}
      </section>
    </main>
  );
};

export default Home;
