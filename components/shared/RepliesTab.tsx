import { fetchUsersReplies } from "@/database/user/user.actions";
import ReplayCard from "../cards/ReplayCard";
import ThreadsInfiniteScroll from "./ThreadsInfiniteScroll";

type TProps = {
  currentUser_Id: string; // _id
  user_id: string; // _id
};

const RepliesTab = async ({ user_id, currentUser_Id }: TProps) => {
  const limit = 2;
  const result = await fetchUsersReplies(user_id, 1, limit);

  return (
    <section className="mt-9  max-sm:mt-5 flex flex-col gap-10  max-sm:gap-4">
      {result.threads.map((thread: any) => (
        <ReplayCard
          key={`thread-with-replies-${thread?._id}`}
          thread={{
            _id: thread?._id,
            author: thread?.author,
            text: thread?.text,
          }}
          reply={thread.replies}
          currentUser_Id={currentUser_Id}
        />
      ))}
      <ThreadsInfiniteScroll
        user_Id={currentUser_Id}
        isReplayCard={true}
        limit={limit}
        fetchFunc={fetchUsersReplies}
        args={[user_id]}
      />
    </section>
  );
};

export default RepliesTab;
