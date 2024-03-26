import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@/database/auth/auth.actions";
import { fetchUser } from "@/database/user/user.actions";
import { TUser } from "@/database/user/user.interface";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (user?.onboarded) redirect("/");

  const userData = {
    _id: `${user._id}`,
    username: user?.username || "",
    name: user?.name || "",
    bio: user?.bio || "",
    image: user?.image || null,
  };
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads.
      </p>

      <section className="mt-9  max-sm:mt-5 bg-dark-2 p-10">
        <AccountProfile
          user={userData as unknown as TUser}
          btnTitle="Let's get started"
        />
      </section>
    </main>
  );
};

export default OnboardingPage;
