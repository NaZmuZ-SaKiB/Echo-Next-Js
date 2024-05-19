"use client";

import Link from "next/link";
import { readNotification } from "@/database/notification/notification.actions";
import { TUser } from "@/database/user/user.interface";

type TProps = {
  activityId: string;
  link: string;
  read: boolean;
  JSONPeople: string;
  peopleCount: number;
};

const LikeNotificationCard = ({
  activityId,
  link,
  read,
  JSONPeople,
  peopleCount,
}: TProps) => {
  const people: TUser[] = JSON.parse(JSONPeople);

  const handleReadNotification = async () => {
    try {
      readNotification(activityId);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const renderPeopleNames = () => {
    if (people.length === 1) return people[0].name;
    if (people.length === 2) return `${people[0].name} and ${people[1].name}`;
    if (people.length === 3)
      return `${people[0].name}, ${people[1].name} and ${people[2].name}`;
    if (people.length > 3)
      return `${people[0].name}, ${people[1].name}, ${people[2].name} and ${
        peopleCount - 3
      } others`;
    return "";
  };
  return (
    <Link href={link} onClick={handleReadNotification}>
      <article className="activity-card">
        {!read && <div className="size-3 bg-primary-500 rounded-full mr-2" />}

        <p className="!text-small-regular text-light-1">
          {renderPeopleNames()} {peopleCount > 1 ? "have" : "has"} liked your
          post
        </p>
      </article>
    </Link>
  );
};

export default LikeNotificationCard;
