import Link from "next/link";
import { redirect } from "next/navigation";

import { TUser } from "@/database/user/user.interface";
import AccountProfile from "@/components/forms/AccountProfile";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/database/auth/auth.actions";

const ProfileEditPage = async () => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userData = {
    _id: `${user?._id}`,
    username: user?.username || "",
    name: user?.name || "",
    bio: user?.bio || "",
    image: user?.image || null,
  };

  return (
    <>
      <div className="flex justify-between gap-3">
        <div>
          <h1 className="head-text">Edit Profile</h1>
          <p className="mt-3 text-base-regular text-light-2">
            Make any changes
          </p>
        </div>
        <Link href="/change-password">
          <Button
            className="bg-transparent border text-primary-500 border-primary-500"
            type="button"
            size="sm"
          >
            Change Password
          </Button>
        </Link>
      </div>
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
