import { redirect } from "next/navigation";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { isUserLoggedIn } from "@/database/auth/auth.actions";

const ChangePasswordPage = async () => {
  const user = await isUserLoggedIn();
  if (!user) redirect("/sign-in");
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Change Password</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Make your account more secure.
      </p>

      <section className="mt-9  max-sm:mt-5 bg-dark-2 p-10">
        <ChangePasswordForm userId={user?.userId} />
      </section>
    </main>
  );
};

export default ChangePasswordPage;
