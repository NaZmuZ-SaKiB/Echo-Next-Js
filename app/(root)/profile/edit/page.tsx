import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/database/user/user.actions";
import { TUser } from "@/database/user/user.interface";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ProfileEditPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    _id: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
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
