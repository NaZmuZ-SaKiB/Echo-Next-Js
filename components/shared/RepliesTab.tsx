import { fetchUsersReplies } from "@/database/user/user.actions";
import ReplayCard from "../cards/ReplayCard";

type TProps = {
  currentUser_Id: string; // _id
  user_id: string; // _id
};

const RepliesTab = async ({ user_id, currentUser_Id }: TProps) => {
  const result = await fetchUsersReplies(user_id);

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {result.map((thread: any) =>
        thread?.replies?.map((reply: any) => (
          <ReplayCard
            key={`thread-with-replies-${thread?._id?.toString()}`}
            thread={{
              _id: thread?._id,
              author: thread?.author,
              text: thread?.text,
            }}
            reply={reply}
            currentUser_Id={currentUser_Id.toString()}
          />
        ))
      )}
    </section>
  );
};

export default RepliesTab;
