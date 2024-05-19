import ProfileHeaderLoading from "@/components/loaders/ProfileHeaderLoading";
import EchoCardLoading from "@/components/loaders/EchoCardLoading";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePageLoading = () => {
  return (
    <section>
      <ProfileHeaderLoading />

      <div className="mt-9 max-sm:mt-5">
        <div className="w-full">
          <Skeleton className="tab" />

          <div className="w-full mt-10 space-y-10">
            <EchoCardLoading isComment={false} />
            <EchoCardLoading isComment={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePageLoading;
