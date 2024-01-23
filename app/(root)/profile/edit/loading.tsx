import AccountProfileLoading from "@/components/loaders/AccountProfileLoading";

const EditProfilePageLoading = () => {
  return (
    <>
      <h1 className="head-text">Edit Profile</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12">
        <AccountProfileLoading btnTitle="Save Changes" />
      </section>
    </>
  );
};

export default EditProfilePageLoading;
