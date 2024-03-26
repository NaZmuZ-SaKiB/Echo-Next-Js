import { redirect } from "next/navigation";
import PostThread from "@/components/forms/PostThread";
import { currentUser } from "@/database/auth/auth.actions";

const CreateThreadPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Echo</h1>
      <PostThread user_Id={`${user._id}`} />
    </>
  );
};

export default CreateThreadPage;
