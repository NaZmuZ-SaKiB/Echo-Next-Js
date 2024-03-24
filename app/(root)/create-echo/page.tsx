import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/database/user/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CreateThreadPage = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Echo</h1>
      <PostThread user_Id={`${userInfo._id}`} />
    </>
  );
};

export default CreateThreadPage;
