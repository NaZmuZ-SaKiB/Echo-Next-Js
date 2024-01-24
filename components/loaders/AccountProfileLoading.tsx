import { Skeleton } from "../ui/skeleton";

const AccountProfileLoading = ({ btnTitle }: { btnTitle: string }) => {
  return (
    <div className="flex flex-col justify-start gap-10  max-sm:gap-6">
      <div className="flex items-center gap-4">
        <div className="account-form_image-label">
          <Skeleton className="rounded-full size-[96px]  max-sm:size-14 opacity-10" />
        </div>
        <div className="flex-1 text-base-semibold text-gray-200">
          <div className="account-form_image-input" />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="opacity-20 h-4 w-16" />
        <div>
          <Skeleton className="account-form_input h-10" />
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="opacity-20 h-4 w-16" />
        <div>
          <Skeleton className="account-form_input h-10" />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Skeleton className="opacity-20 h-4 w-10" />
        <Skeleton className="account-form_input h-56" />
      </div>

      <Skeleton className="w-full h-9 flex justify-center items-center opacity-15">
        {btnTitle}
      </Skeleton>
    </div>
  );
};

export default AccountProfileLoading;
