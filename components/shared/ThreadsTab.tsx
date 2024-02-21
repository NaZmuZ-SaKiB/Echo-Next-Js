import { redirect } from "next/navigation";
import { fetchCommunityThreads } from "@/database/community/community.actions";
import { fetchUserThreads } from "@/database/user/user.actions";
import ThreadCard2 from "../cards/ThreadCard2";
import { TThreadProfilePage } from "@/database/thread/thread.interface";

type TProps = {
  currentUser_Id: string; // _id
  fetchAccount_Id: string; // _id
  accountType: "User" | "Community";
};

const ThreadsTab = async ({
  fetchAccount_Id,
  accountType,
  currentUser_Id,
}: TProps) => {
  let result: any;

  if (accountType === "Community") {
    result = await fetchCommunityThreads(fetchAccount_Id);
    if (!result) return redirect("/");
  } else {
    result = await fetchUserThreads(fetchAccount_Id);
    if (!result) return redirect("/");
  }

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {result.map((thread: TThreadProfilePage) => (
        <ThreadCard2
          key={`${thread._id}`}
          currentUser_Id={currentUser_Id}
          JSONThread={JSON.stringify(thread)}
          isComment={false}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
