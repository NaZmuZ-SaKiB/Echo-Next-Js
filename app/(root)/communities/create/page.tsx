import CreateCommunity from "@/components/forms/CreateCommunity";
import { currentUser } from "@/database/auth/auth.actions";
import { redirect } from "next/navigation";

const CreateCommunityPage = async () => {
  const user = await currentUser();
  if (!user) return null;
  if (!user?.onboarded) redirect("/onboarding");

  return (
    <main>
      <h1 className="head-text mb-10 max-sm:mb-4">Create Community</h1>

      <section className="mt-9  max-sm:mt-5 bg-dark-2 p-10">
        <CreateCommunity userId={user.id} btnTitle="Create Community" />
      </section>
    </main>
  );
};

export default CreateCommunityPage;
