import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@/database/auth/auth.actions";
import { fetchUser } from "@/database/user/user.actions";
import { TUser } from "@/database/user/user.interface";
import { redirect } from "next/navigation";

const ProfileEditPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const userData = {
    _id: `${user?._id}`,
    username: user?.username || "",
    name: user?.name || "",
    bio: user?.bio || "",
    image: user?.image || null,
  };

  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12 max-sm:mt-6">
        <AccountProfile
          user={userData as unknown as TUser}
          btnTitle="Save Changes"
        />
      </section>
    </>
  );
};

export default ProfileEditPage;
