"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { readNotification } from "@/database/notification/notification.actions";

type TProps = {
  activityId: string;
  link: string;
  image: string | null | undefined;
  communityName: string | undefined;
  read: boolean;
  accepted: boolean;
};

const InvitationNotificationCard = ({
  activityId,
  link,
  image,
  communityName,
  read,
  accepted,
}: TProps) => {
  const handleReadNotification = async () => {
    try {
      readNotification(activityId);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Link href={link} onClick={handleReadNotification}>
      <article className="activity-card">
        {!read && <div className="size-3 bg-primary-500 rounded-full mr-2" />}
        <Image
          src={image || "/assets/profile.svg"}
          alt="user_logo"
          width={20}
          height={20}
          className="rounded-full object-cover"
        />
        <p className="!text-small-regular text-light-1">
          You are invited to join the "{communityName}" community.
        </p>
        <Button
          className={`ml-auto ${
            !accepted && "bg-primary-500"
          } !text-small-regular text-light-1`}
          size="sm"
        >
          {accepted ? "Accepted" : "Accept"}
        </Button>
      </article>
    </Link>
  );
};

export default InvitationNotificationCard;
