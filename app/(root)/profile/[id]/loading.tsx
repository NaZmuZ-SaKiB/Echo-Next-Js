import ProfileHeaderLoading from "@/components/loaders/ProfileHeaderLoading";
import ThreadCardLoading from "@/components/loaders/ThreadCardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePageLoading = () => {
  return (
    <section>
      <ProfileHeaderLoading />

      <div className="mt-9 max-sm:mt-5">
        <div className="w-full">
          <Skeleton className="tab" />

          <div className="w-full mt-10 space-y-10">
            <ThreadCardLoading isComment={false} />
            <ThreadCardLoading isComment={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePageLoading;
