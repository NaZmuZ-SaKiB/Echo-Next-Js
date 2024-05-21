import Image from "next/image";
import Link from "next/link";

import EchoCard from "./EchoCard";

type TProps = {
  echo: any;
  reply: any;
  currentUser_Id: string;
};

const ReplayCard = ({ echo, reply, currentUser_Id }: TProps) => {
  return (
    <div>
      <Link
        href={`/echo/${echo?._id}`}
        className={`flex w-full flex-col rounded-xl bg-dark-4 opacity-50 p-5 max-h-20 max-w-[70%] overflow-hidden max-sm:p-3`}
      >
        <div className="flex items-start justify-between">
          <div className="flex w-full flex-1 flex-row gap-4 max-sm:gap-3">
            <div className="flex flex-col items-center">
              <div className="relative size-11 max-sm:size-9">
                <Image
                  src={echo?.author?.image}
                  alt="Profile image"
                  fill
                  className="rounded-full"
                />
              </div>
              <div className="echo-card_bar" />
            </div>

            <div className="flex w-full flex-col">
              <div className="w-fit">
                <h4 className="text-base-semibold text-light-1">
                  {echo?.author?.name}
                </h4>
              </div>
              <p className="mt-2 text-small-regular text-light-2">
                {echo?.text}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <EchoCard
        key={`${reply._id}`}
        currentUser_Id={currentUser_Id}
        JSONEcho={JSON.stringify(reply)}
        isComment={false}
      />
    </div>
  );
};

export default ReplayCard;
