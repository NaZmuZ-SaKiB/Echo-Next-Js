import ThreadCardLoading from "./ThreadCardLoading";

const ThreadsTabLoading = () => {
  return (
    <div className="w-full mt-10 max-sm:mt-5 space-y-10 max-sm:space-y-4">
      <ThreadCardLoading isComment={false} />
      <ThreadCardLoading isComment={false} />
    </div>
  );
};

export default ThreadsTabLoading;
