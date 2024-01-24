import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/database/community/community.actions";
import { fetchUserThreads } from "@/database/user/user.actions";

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
    <section className="mt-9 flex flex-col gap-10">
      {result.map((thread: any) => (
        <ThreadCard
          key={thread._id.toString()}
          thread_Id={thread._id.toString()}
          currentUser_Id={currentUser_Id.toString()}
          parent_Id={null}
          content={thread.text}
          author={{
            _id: thread.author._id,
            name: thread.author.name,
            image: thread.author.image,
            id: thread.author.id,
            username: thread.author.username,
          }}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.replies}
          likes={thread.likes}
          isComment={false}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
