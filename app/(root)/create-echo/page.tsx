import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";
import { currentUser } from "@/database/auth/auth.actions";
import { getUsersCommunities } from "@/database/community/community.actions";

const CreateThreadPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const communities = await getUsersCommunities(`${user._id}`);

  return (
    <>
      <h1 className="head-text">Create Echo</h1>
      <PostThread
        user_Id={`${user._id}`}
        jsonCommunities={JSON.stringify(communities)}
        user_name={user?.name || "Yourself"}
      />
    </>
  );
};

export default CreateThreadPage;
