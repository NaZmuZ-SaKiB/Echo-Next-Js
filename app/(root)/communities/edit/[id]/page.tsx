import { notFound, redirect } from "next/navigation";

import Community from "@/components/forms/Community";
import { isUserLoggedIn } from "@/database/auth/auth.actions";
import { fetchCommunityInfo } from "@/database/community/community.actions";

const CommunityEditPage = async ({ params }: { params: { id: string } }) => {
  const user = await isUserLoggedIn();
  if (!user) redirect("/sign-in");

  const community = await fetchCommunityInfo(params.id);
  if (!community) notFound();

  if (user.userId !== `${community.createdBy}`) {
    redirect("/");
  }

  return (
    <>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12 max-sm:mt-6">
        <Community
          userId={user.userId}
          JsonCommunity={JSON.stringify(community)}
          btnTitle="Update Changes"
        />
      </section>
    </>
  );
};

export default CommunityEditPage;
