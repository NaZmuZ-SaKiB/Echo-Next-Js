import { redirect } from "next/navigation";

import Community from "@/components/forms/Community";
import { isUserLoggedIn } from "@/database/auth/auth.actions";

const CreateCommunityPage = async () => {
  const user = await isUserLoggedIn();
  if (!user) redirect("/sign-in");

  return (
    <main>
      <h1 className="head-text mb-10 max-sm:mb-4">Create Community</h1>

      <section className="mt-9  max-sm:mt-5 bg-dark-2 p-10">
        <Community userId={user.userId} btnTitle="Create Community" />
      </section>
    </main>
  );
};

export default CreateCommunityPage;
