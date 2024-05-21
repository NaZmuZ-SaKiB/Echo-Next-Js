import { redirect } from "next/navigation";

import EchoCard from "@/components/cards/EchoCard";
import EchosInfiniteScroll from "@/components/shared/EchosInfiniteScroll";
import { isUserLoggedIn } from "@/database/auth/auth.actions";
import { fetchThreads } from "@/database/thread/thread.actions";

const Home = async () => {
  const user = await isUserLoggedIn();
  if (!user) redirect("/sign-in");

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
                currentUser_Id={user.userId}
                JSONEcho={JSON.stringify(thread)}
              />
            ))}
            <EchosInfiniteScroll
              limit={limit}
              user_Id={user.userId}
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
