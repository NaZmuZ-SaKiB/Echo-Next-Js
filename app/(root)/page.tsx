import EchoCard from "@/components/cards/EchoCard";
import EchosInfiniteScroll from "@/components/shared/EchosInfiniteScroll";
import { currentUser } from "@/database/auth/auth.actions";
import { fetchThreads } from "@/database/thread/thread.actions";

const Home = async () => {
  const user = await currentUser();

  const limit = 4;
  const result = await fetchThreads(1, limit);

  return (
    <main>
      <h1 className="head-text">Home</h1>
      <section className="mt-9 max-sm:mt-4 flex flex-col gap-10 max-sm:gap-4">
        {result?.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.threads.map((thread) => (
              <EchoCard
                key={`${thread._id}`}
                currentUser_Id={`${user?._id}` || ""}
                JSONThread={JSON.stringify(thread)}
              />
            ))}
            <EchosInfiniteScroll
              limit={limit}
              user_Id={`${user?._id}`}
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
