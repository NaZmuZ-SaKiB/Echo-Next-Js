import ThreadCard from "../cards/ThreadCard";
import Link from "next/link";
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
      {result.map((reply: any) => (
        <ReplayCard
          key={`reply-${reply?._id?.toString()}`}
          reply={reply}
          currentUser_Id={currentUser_Id.toString()}
        />
      ))}
    </section>
  );
};

export default RepliesTab;
