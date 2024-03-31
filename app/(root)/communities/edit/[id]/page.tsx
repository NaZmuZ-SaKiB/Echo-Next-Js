import Community from "@/components/forms/Community";
import { currentUser } from "@/database/auth/auth.actions";
import { fetchCommunityInfo } from "@/database/community/community.actions";
import { redirect } from "next/navigation";

const CommunityEditPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const community = await fetchCommunityInfo(params.id);

  return (
    <>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12 max-sm:mt-6">
        <Community
          userId={`${user?._id}`}
          JsonCommunity={JSON.stringify(community)}
          btnTitle="Update Changes"
        />
      </section>
    </>
  );
};

export default CommunityEditPage;
