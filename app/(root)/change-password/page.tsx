import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { currentUser } from "@/database/auth/auth.actions";

const ChangePasswordPage = async () => {
  const user = await currentUser();
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Change Password</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Make your account more secure.
      </p>

      <section className="mt-9  max-sm:mt-5 bg-dark-2 p-10">
        <ChangePasswordForm userId={`${user?._id}`} />
      </section>
    </main>
  );
};

export default ChangePasswordPage;
