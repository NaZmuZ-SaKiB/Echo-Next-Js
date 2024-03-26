import ThreadCard from "@/components/cards/ThreadCard";
import ThreadsInfiniteScroll from "@/components/shared/ThreadsInfiniteScroll";
import { currentUser } from "@/database/auth/auth.actions";
import { fetchThreads } from "@/database/thread/thread.actions";

const Home = async () => {
  const limit = 4;
  const result = await fetchThreads(1, limit);
  // const user = await currentUser();
  const user = await currentUser();

  let userInfo = {
    id: "user_2bARJaBCwFPcIZ0mHBIuJU4Kvkw",
    _id: "65afca928860cc939ce280b1",
  };
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
