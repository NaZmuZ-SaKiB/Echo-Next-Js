import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

type TProps = {
  isComment: boolean;
};

const EchoCardLoading = ({ isComment }: TProps) => {
  return (
    <div
      className={`
        flex w-full flex-col rounded-xl h-44
        ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7 max-sm:p-3"}
    `}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4 max-sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Skeleton className="opacity-10 rounded-full size-11 max-sm:size-9" />
            </div>
            <div className="echo-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Skeleton className="opacity-30 mt-1 w-14 h-2 text-base-semibold text-light-1" />

            <div className="mt-4 text-small-regular text-light-2 flex flex-col gap-3">
              <Skeleton className="opacity-80 w-[70%] h-3" />
              <Skeleton className="opacity-45 w-[80%] h-3" />
              <Skeleton className="opacity-25 w-[30%] h-3" />
            </div>
            <div
              className={`${
                isComment && "mb-10"
              } mt-5 max-sm:mt-3 flex flex-col gap-3`}
            >
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/reply.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/repost.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoCardLoading;
