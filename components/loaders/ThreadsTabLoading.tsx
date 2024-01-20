import ThreadCardLoading from "./ThreadCardLoading";

const ThreadsTabLoading = () => {
  return (
    <div className="w-full mt-10 space-y-10">
      <ThreadCardLoading isComment={false} />
      <ThreadCardLoading isComment={false} />
    </div>
  );
};

export default ThreadsTabLoading;
