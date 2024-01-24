import { Skeleton } from "../ui/skeleton";

const ProfileHeaderLoading = () => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative size-20 object-cover">
            <Skeleton className="opacity-10 rounded-full  size-full shadow-2xl" />
          </div>
          <div className="flex-1 space-y-3">
            <Skeleton className="opacity-40 w-40 h-5 rounded-3xl" />
            <Skeleton className="opacity-70 w-20 h-3" />
          </div>
        </div>
      </div>
      {/* todo: community */}
      <Skeleton className="opacity-30 mt-6 max-w-[70%] h-3" />
      <Skeleton className="opacity-70 mt-2 max-w-[30%] h-3" />
      <div className="mt-12 max-sm:mt-5 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeaderLoading;
