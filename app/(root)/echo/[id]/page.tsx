import { redirect } from "next/navigation";

import Comment from "@/components/forms/Comment";
import EchoCard from "@/components/cards/EchoCard";
import { fetchThreadById } from "@/database/thread/thread.actions";
import { currentUser } from "@/database/auth/auth.actions";

const EchoPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const echo = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <EchoCard
          currentUser_Id={`${user?._id}` || ""}
          JSONEcho={JSON.stringify(echo)}
        />
      </div>

      <div className="mt-7">
        <Comment
          thread_Id={`${echo._id}`}
          currentUserImg={user.image || ""}
          currentUser_Id={`${user._id}`}
        />
      </div>

      <div className="mt-10">
        {echo.replies.map((reply) => (
          <EchoCard
            key={`${reply._id}`}
            currentUser_Id={`${user?._id}` || ""}
            JSONEcho={JSON.stringify(reply)}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default EchoPage;
