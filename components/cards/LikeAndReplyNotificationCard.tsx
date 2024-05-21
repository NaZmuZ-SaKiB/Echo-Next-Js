"use client";

import Link from "next/link";
import Image from "next/image";

import { TUser } from "@/database/user/user.interface";
import { readNotification } from "@/database/notification/notification.actions";

type TProps = {
  activityId: string;
  link: string;
  read: boolean;
  JSONPeople: string;
  peopleCount: number;
  type: "liked" | "replied";
};

const LikeAndReplyNotificationCard = ({
  activityId,
  link,
  read,
  JSONPeople,
  peopleCount,
  type,
}: TProps) => {
  const people: TUser[] = JSON.parse(JSONPeople);

  const handleReadNotification = async () => {
    try {
      readNotification(activityId);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const renderName = (name?: string) => {
    return <span className="font-bold">{name}</span>;
  };

  const renderPeopleNames = () => {
    if (people.length === 1) return renderName(people[0].name);
    if (people.length === 2)
      return `${renderName(people[0].name)} and ${renderName(people[1].name)}`;
    if (people.length === 3)
      return `${renderName(people[0].name)}, ${renderName(
        people[1].name
      )} and ${renderName(people[2].name)}`;
    if (people.length > 3)
      return `${renderName(people[0].name)}, ${renderName(
        people[1].name
      )}, ${renderName(people[2].name)} and ${peopleCount - 3} others`;
    return "";
  };
  return (
    <Link href={link} onClick={handleReadNotification}>
      <article className="activity-card">
        {!read && <div className="size-3 bg-primary-500 rounded-full mr-2" />}

        <Image
          src={people[0].image || "/assets/profile.svg"}
          alt="user_logo"
          width={20}
          height={20}
          className="rounded-full object-cover"
        />

        <p className="!text-small-regular text-light-1">
          {renderPeopleNames()} {peopleCount > 1 ? "have" : "has"} {type} your
          post
        </p>
      </article>
    </Link>
  );
};

export default LikeAndReplyNotificationCard;
