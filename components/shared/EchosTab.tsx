import { redirect } from "next/navigation";
import { fetchCommunityThreads } from "@/database/community/community.actions";
import { fetchUserThreads } from "@/database/user/user.actions";
import EchoCard from "../cards/EchoCard";
import { TThreadProfilePage } from "@/database/thread/thread.interface";
import EchosInfiniteScroll from "./EchosInfiniteScroll";

type TProps = {
  currentUser_Id: string; // _id
  fetchAccount_Id: string; // _id
  accountType: "User" | "Community";
};

const EchosTab = async ({
  fetchAccount_Id,
  accountType,
  currentUser_Id,
}: TProps) => {
  const limit = 5;
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityThreads(fetchAccount_Id, 1, limit);
    if (!result) return redirect("/");
  } else {
    result = await fetchUserThreads(fetchAccount_Id, 1, limit);
    if (!result) return redirect("/");
  }

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {result.threads.map((thread: TThreadProfilePage) => (
        <EchoCard
          key={`${thread._id}`}
          currentUser_Id={currentUser_Id}
          JSONThread={JSON.stringify(thread)}
          isComment={false}
        />
      ))}
      <EchosInfiniteScroll
        limit={limit}
        user_Id={currentUser_Id}
        fetchFunc={
          accountType === "Community" ? fetchCommunityThreads : fetchUserThreads
        }
        args={[fetchAccount_Id]}
      />
    </section>
  );
};

export default EchosTab;
