import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/database/user/user.actions";
import { fetchThreadById } from "@/database/thread/thread.actions";
import Comment from "@/components/forms/Comment";
import ThreadCard2 from "@/components/cards/ThreadCard2";

const ThreadPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard2
          currentUser_Id={`${userInfo?._id}` || ""}
          JSONThread={JSON.stringify(thread)}
        />
      </div>

      <div className="mt-7">
        <Comment
          thread_Id={`${thread._id}`}
          currentUserImg={userInfo.image || user.imageUrl}
          currentUser_Id={`${userInfo._id}`}
        />
      </div>

      <div className="mt-10">
        {thread.replies.map((reply) => (
          <ThreadCard2
            key={`${reply._id}`}
            currentUser_Id={`${userInfo?._id}` || ""}
            JSONThread={JSON.stringify(reply)}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadPage;
