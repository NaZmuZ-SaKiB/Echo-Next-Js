import AccountProfileLoading from "@/components/loaders/AccountProfileLoading";

const EditCommunityPageLoading = () => {
  return (
    <>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">Make any changes</p>

      <section className="mt-12 max-sm:mt-6">
        <AccountProfileLoading btnTitle="Save Changes" />
      </section>
    </>
  );
};

export default EditCommunityPageLoading;
